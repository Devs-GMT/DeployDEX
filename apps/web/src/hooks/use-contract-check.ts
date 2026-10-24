"use client";

import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { isAddress, type Address } from "viem";
import { deployDexAbi } from "@/lib/abi";
import { CHAIN, REGISTRY_ADDRESS, REGISTRY_DEPLOYED } from "@/lib/config";

export interface ContractCheck {
  isContract: boolean;
  /** Deployed bytecode size in bytes (0 for EOAs). */
  codeSize: number;
  listedId: number | null;
  /** The address belongs to the connected wallet, not a contract. */
  isSelf: boolean;
  /** The address is the DeployDex registry itself. */
  isRegistry: boolean;
}

/**
 * Live check: is `address` a deployed contract on the active chain, and is it already listed?
 * `self` is the connected wallet, used to catch "that's your wallet" mistakes.
 */
export function useContractCheck(address: string, self?: string) {
  const client = usePublicClient({ chainId: CHAIN.id });
  const valid = isAddress(address);
  return useQuery({
    queryKey: ["contract-check", REGISTRY_ADDRESS, address.toLowerCase(), self?.toLowerCase()],
    enabled: !!client && valid,
    staleTime: 30_000,
    queryFn: async (): Promise<ContractCheck> => {
      const empty: ContractCheck = {
        isContract: false,
        codeSize: 0,
        listedId: null,
        isSelf: false,
        isRegistry: false,
      };
      if (!client) return empty;
      const target = address as Address;
      const code = await client.getCode({ address: target });
      const isContract = !!code && code !== "0x";

      let listedId: number | null = null;
      if (REGISTRY_DEPLOYED) {
        const listed = await client.readContract({
          address: REGISTRY_ADDRESS,
          abi: deployDexAbi,
          functionName: "idOfTarget",
          args: [target],
        });
        listedId = listed[0] ? Number(listed[1]) : null;
      }

      return {
        isContract,
        codeSize: isContract ? (code.length - 2) / 2 : 0,
        listedId,
        isSelf: !!self && target.toLowerCase() === self.toLowerCase(),
        isRegistry: REGISTRY_DEPLOYED && target.toLowerCase() === REGISTRY_ADDRESS.toLowerCase(),
      };
    },
  });
}

const ownerAbi = [
  {
    type: "function",
    name: "owner",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
] as const;

/** Optional badge: does the target contract's owner() equal the lister? */
export function useIsContractOwner(target: Address, lister: Address) {
  const client = usePublicClient({ chainId: CHAIN.id });
  return useQuery({
    queryKey: ["owner-check", target, lister],
    enabled: !!client && isAddress(target) && isAddress(lister),
    staleTime: Infinity,
    retry: false,
    queryFn: async () => {
      if (!client) return false;
      try {
        const owner = await client.readContract({
          address: target,
          abi: ownerAbi,
          functionName: "owner",
        });
        return owner.toLowerCase() === lister.toLowerCase();
      } catch {
        return false;
      }
    },
  });
}
