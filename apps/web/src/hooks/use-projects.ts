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
