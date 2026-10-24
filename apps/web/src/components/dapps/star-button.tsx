"use client";

import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { WalletGate } from "@/components/web3/wallet-gate";
import { useIsStarred } from "@/hooks/use-projects";
import { useRegistryWrite } from "@/hooks/use-registry-write";
import { useIsClient } from "@/hooks/use-is-client";
import type { Dapp } from "@/lib/types";

export function StarButton({ dapp, size = "sm" }: { dapp: Dapp; size?: "sm" | "md" }) {
  const mounted = useIsClient();
  const { address } = useAccount();
  const { data: starred } = useIsStarred(dapp.id, address);
  const { state, run } = useRegistryWrite();

  if (mounted && address && address.toLowerCase() === dapp.lister.toLowerCase()) {
    return <span className="px-2 text-sm text-muted">Your project</span>;
  }

  const pending = state.status === "pending";
  const action = starred ? "unstar" : "star";

  return (
    <div className="flex flex-col items-end gap-1">
      <WalletGate prompt="Connect your wallet to star.">
        <Button
          variant={starred ? "outline" : "primary"}
          size={size}
          disabled={pending}
          onClick={() => run(action, [BigInt(dapp.id)])}
        >
          {pending ? "Waiting…" : starred ? "Unstar" : "⭐ Star"}
        </Button>
      </WalletGate>
      {state.status === "error" && (
        <span role="alert" className="max-w-48 text-right text-xs text-pink">
          {state.message}
        </span>
      )}
    </div>
  );
}
