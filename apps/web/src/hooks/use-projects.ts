"use client";

import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import type { Address } from "viem";
import { deployDexAbi } from "@/lib/abi";
import { CHAIN, REGISTRY_ADDRESS, REGISTRY_DEPLOYED } from "@/lib/config";
import type { Dapp } from "@/lib/types";

type RawProject = {
  lister: Address;
  target: Address;
  name: string;
  tagline: string;
  category: number;
  liveUrl: string;
  repo: string;
  logoUrl: string;
  stars: number;
  hidden: boolean;
  listedAt: bigint;
  updatedAt: bigint;
};

const PAGE = 100n;

const toDapp = (p: RawProject, id: number): Dapp => ({
  lister: p.lister,
  target: p.target,
  name: p.name,
  tagline: p.tagline,
  category: p.category,
  liveUrl: p.liveUrl,
  repo: p.repo,
  logoUrl: p.logoUrl,
  stars: p.stars,
  hidden: p.hidden,
  id,
  listedAt: Number(p.listedAt),
  updatedAt: Number(p.updatedAt),
});

/** All visible (non-hidden) projects, read from chain. Works without a wallet. */
export function useProjects() {
  const client = usePublicClient({ chainId: CHAIN.id });
  return useQuery({
    queryKey: ["projects", REGISTRY_ADDRESS],
    enabled: !!client && REGISTRY_DEPLOYED,
    queryFn: async (): Promise<Dapp[]> => {
      if (!client) return [];
      const total = await client.readContract({
        address: REGISTRY_ADDRESS,
        abi: deployDexAbi,
        functionName: "total",
      });
      const all: Dapp[] = [];
      for (let from = 0n; from < total; from += PAGE) {
        const page = (await client.readContract({
          address: REGISTRY_ADDRESS,
          abi: deployDexAbi,
          functionName: "getProjects",
          args: [from, PAGE],
        })) as unknown as RawProject[];
        page.forEach((p, i) => all.push(toDapp(p, Number(from) + i)));
      }
      return all.filter((d) => !d.hidden);
    },
  });
}

/** A single project. Hidden or missing projects resolve to null. */
export function useProject(id: number) {
  const client = usePublicClient({ chainId: CHAIN.id });
  return useQuery({
    queryKey: ["project", REGISTRY_ADDRESS, id],
    enabled: !!client && REGISTRY_DEPLOYED && Number.isInteger(id) && id >= 0,
    queryFn: async (): Promise<Dapp | null> => {
      if (!client) return null;
      try {
        const p = (await client.readContract({
          address: REGISTRY_ADDRESS,
          abi: deployDexAbi,
          functionName: "getProject",
          args: [BigInt(id)],
        })) as unknown as RawProject;
        const d = toDapp(p, id);
        return d.hidden ? null : d;
      } catch {
        return null;
      }
    },
  });
}

export function useMyIds(kind: "listedOf" | "starredOf", address?: Address) {
  const client = usePublicClient({ chainId: CHAIN.id });
  return useQuery({
    queryKey: [kind, REGISTRY_ADDRESS, address],
    enabled: !!client && !!address && REGISTRY_DEPLOYED,
    queryFn: async () => {
      if (!client || !address) return [];
      const ids = await client.readContract({
        address: REGISTRY_ADDRESS,
        abi: deployDexAbi,
        functionName: kind,
        args: [address],
      });
      return ids.map(Number);
    },
  });
}

export function useIsStarred(id: number, address?: Address) {
  const client = usePublicClient({ chainId: CHAIN.id });
  return useQuery({
    queryKey: ["isStarred", REGISTRY_ADDRESS, id, address],
    enabled: !!client && !!address && REGISTRY_DEPLOYED,
    queryFn: async () => {
      if (!client || !address) return false;
      return client.readContract({
        address: REGISTRY_ADDRESS,
        abi: deployDexAbi,
        functionName: "isStarred",
        args: [BigInt(id), address],
      });
    },
  });
}

const WEEK_SECONDS = 7 * 24 * 3600;

/**
 * Net stars per project id over the last 7 days, tallied from Starred/Unstarred events.
 * Returns null when logs are unavailable so callers can fall back to all-time totals.
 */
export function useWeeklyStars() {
  const client = usePublicClient({ chainId: CHAIN.id });
  return useQuery({
    queryKey: ["weekly-stars", REGISTRY_ADDRESS],
    enabled: !!client && REGISTRY_DEPLOYED,
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: async (): Promise<Map<number, number> | null> => {
      if (!client) return null;
      try {
        const latest = await client.getBlockNumber();
        const sample = latest > 1000n ? 1000n : latest;
        const [a, b] = await Promise.all([
          client.getBlock({ blockNumber: latest }),
          client.getBlock({ blockNumber: latest - sample }),
        ]);
        const secPerBlock = sample > 0n ? Number(a.timestamp - b.timestamp) / Number(sample) : 0;
        if (!(secPerBlock > 0)) return null;
        const span = BigInt(Math.ceil(WEEK_SECONDS / secPerBlock));
        const fromBlock = latest > span ? latest - span : 0n;
        const [up, down] = await Promise.all([
          client.getContractEvents({ address: REGISTRY_ADDRESS, abi: deployDexAbi, eventName: "Starred", fromBlock, toBlock: latest }),
          client.getContractEvents({ address: REGISTRY_ADDRESS, abi: deployDexAbi, eventName: "Unstarred", fromBlock, toBlock: latest }),
        ]);
        const tally = new Map<number, number>();
        for (const e of up) tally.set(Number(e.args.id), (tally.get(Number(e.args.id)) ?? 0) + 1);
        for (const e of down) tally.set(Number(e.args.id), (tally.get(Number(e.args.id)) ?? 0) - 1);
        return tally;
      } catch {
        return null;
      }
    },
  });
}
