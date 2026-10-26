"use client";

import { useQuery } from "@tanstack/react-query";
import { isAddress, type Address } from "viem";
import { z } from "zod";

const trustSchema = z.object({
  verified: z.boolean(),
  name: z.string().nullable(),
  compiler: z.string().nullable(),
  verifiedAt: z.string().nullable(),
  creator: z.string().nullable(),
});

export type ContractTrust = z.infer<typeof trustSchema>;

/** Explorer facts about a listing's contract via /api/verify. `null` when the explorer is down. */
export function useContractTrust(target: Address | undefined) {
  return useQuery({
    queryKey: ["trust", target],
    enabled: !!target && isAddress(target),
    staleTime: 60 * 60 * 1000,
    retry: false,
    queryFn: async (): Promise<ContractTrust | null> => {
      const res = await fetch(`/api/verify/${target}`);
      if (!res.ok) return null;
      const parsed = trustSchema.safeParse(await res.json());
      return parsed.success ? parsed.data : null;
    },
  });
}
