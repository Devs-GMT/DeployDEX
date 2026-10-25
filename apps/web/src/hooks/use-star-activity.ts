"use client";

import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import type { Address } from "viem";
import { deployDexAbi } from "@/lib/abi";
import { CHAIN, REGISTRY_ADDRESS, REGISTRY_DEPLOYED } from "@/lib/config";
import { recentBlocks, WEEK_SECONDS } from "./use-projects";

export type StarEvent = {
  kind: "star" | "unstar";
  id: number;
  by: Address;
  /** Estimated from the block number; good to the minute. */
  time: number;
  tx: `0x${string}`;
  key: string;
};

/** Star and unstar events from the last 7 days, newest first. `null` when logs are unavailable. */
export function useStarActivity() {
  const client = usePublicClient({ chainId: CHAIN.id });
  return useQuery({
    queryKey: ["star-activity", REGISTRY_ADDRESS],
    enabled: !!client && REGISTRY_DEPLOYED,
    staleTime: 60 * 1000,
    retry: false,
    queryFn: async (): Promise<StarEvent[] | null> => {
      if (!client) return null;
      try {
        const range = await recentBlocks(client, WEEK_SECONDS);
        if (!range) return null;
        const { fromBlock, latest, timeOf } = range;
        const [up, down] = await Promise.all([
          client.getContractEvents({ address: REGISTRY_ADDRESS, abi: deployDexAbi, eventName: "Starred", fromBlock, toBlock: latest }),
          client.getContractEvents({ address: REGISTRY_ADDRESS, abi: deployDexAbi, eventName: "Unstarred", fromBlock, toBlock: latest }),
        ]);
        const events: StarEvent[] = [
          ...up.map((e) => ({ e, kind: "star" as const })),
          ...down.map((e) => ({ e, kind: "unstar" as const })),
        ].map(({ e, kind }) => ({
          kind,
          id: Number(e.args.id),
          by: e.args.by as Address,
          time: Math.round(timeOf(e.blockNumber)),
          tx: e.transactionHash,
          key: `${e.transactionHash}-${e.logIndex}`,
        }));
        return events.sort((a, b) => b.time - a.time);
      } catch {
        return null;
      }
    },
  });
}
