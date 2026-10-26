"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePublicClient, useWriteContract } from "wagmi";
import { deployDexAbi } from "@/lib/abi";
import { CHAIN, REGISTRY_ADDRESS } from "@/lib/config";

export type TxState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success"; hash: `0x${string}` }
  | { status: "error"; message: string };

const KNOWN_ERRORS: Record<string, string> = {
  NotAContract: "This address has no contract on BOT Chain.",
  AlreadyListed: "This contract is already listed.",
  TooLong: "One of the fields is too long.",
  EmptyName: "Name is required.",
  NotLister: "Only the lister can edit this project.",
  SelfStar: "You can't star your own project.",
  AlreadyStarred: "You already starred this project.",
  NotStarred: "You haven't starred this project.",
  IsDelisted: "This project was delisted by its lister.",
};

function friendly(err: unknown): string {
  const text = err instanceof Error ? err.message : String(err);
  if (/user rejected|user denied|rejected the request/i.test(text)) {
    return "You rejected the request in your wallet.";
  }
  for (const [key, msg] of Object.entries(KNOWN_ERRORS)) if (text.includes(key)) return msg;
  return "The transaction failed. Please try again.";
}

type WriteName = "list" | "update" | "star" | "unstar" | "delist";

export function useRegistryWrite() {
  const client = usePublicClient({ chainId: CHAIN.id });
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();
  const [state, setState] = useState<TxState>({ status: "idle" });

  async function run(functionName: WriteName, args: readonly unknown[]) {
    setState({ status: "pending" });
    try {
      const hash = await writeContractAsync({
        address: REGISTRY_ADDRESS,
        abi: deployDexAbi,
        chainId: CHAIN.id,
        functionName,
        args,
      } as never);
      await client?.waitForTransactionReceipt({ hash });
      await queryClient.invalidateQueries();
      setState({ status: "success", hash });
      return hash;
    } catch (err) {
      setState({ status: "error", message: friendly(err) });
      return null;
    }
  }

  const reset = useCallback(() => setState({ status: "idle" }), []);
  return { state, run, reset };
}
