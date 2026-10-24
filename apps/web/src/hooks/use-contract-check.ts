"use client";

import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { isAddress, type Address } from "viem";
import { deployDexAbi } from "@/lib/abi";
import { CHAIN, REGISTRY_ADDRESS, REGISTRY_DEPLOYED } from "@/lib/config";

export interface ContractCheck {
  isContract: boolean;
  listedId: number | null;
}

/** Live check: is `address` a deployed contract on the active chain, and is it already listed? */
export function useContractCheck(address: string) {
  const client = usePublicClient({ chainId: CHAIN.id });
  const valid = isAddress(address);
  return useQuery({
    queryKey: ["contract-check", REGISTRY_ADDRESS, address.toLowerCase()],
    enabled: !!client && valid && REGISTRY_DEPLOYED,
    queryFn: async (): Promise<ContractCheck> => {
      if (!client) return { isContract: false, listedId: null };
      const target = address as Address;
      const [code, listed] = await Promise.all([
        client.getCode({ address: target }),
        client.readContract({
          address: REGISTRY_ADDRESS,
          abi: deployDexAbi,
          functionName: "idOfTarget",
          args: [target],
        }),
      ]);
      return {
        isContract: !!code && code !== "0x",
        listedId: listed[0] ? Number(listed[1]) : null,
      };
    },
  });
}

const ownerAbi = [
  { type: "function", name: "owner", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
] as const;

/** Optional badge: does the target contract's owner() equal the lister? */
export function useIsContractOwner(target: Address, lister: Address) {
  const client = usePublicClient({ chainId: CHAIN.id });
  return useQuery({
    queryKey: ["owner-check", target, lister],
    enabled: !!client,
    staleTime: Infinity,
    retry: false,
    queryFn: async () => {
      if (!client) return false;
      try {
        const owner = await client.readContract({ address: target, abi: ownerAbi, functionName: "owner" });
        return owner.toLowerCase() === lister.toLowerCase();
      } catch {
        return false;
      }
    },
  });
}
