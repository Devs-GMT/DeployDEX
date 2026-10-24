"use client";

import type { ReactNode } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { CHAIN } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "./connect-button";
import { useIsClient } from "@/hooks/use-is-client";

/** Wraps a write action: asks to connect, then to switch network, then renders children. */
export function WalletGate({
  children,
  prompt = "Connect your wallet to continue.",
}: {
  children: ReactNode;
  prompt?: string;
}) {
  const mounted = useIsClient();
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!mounted) return null;
  if (!isConnected) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-panel p-4 text-sm">
        <span>{prompt}</span>
        <ConnectButton variant="outline" />
      </div>
    );
  }
  if (chainId !== CHAIN.id) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-peach/50 p-4 text-sm">
        <span>Wrong network. Switch to {CHAIN.name} to continue.</span>
        <Button size="sm" disabled={isPending} onClick={() => switchChain({ chainId: CHAIN.id })}>
          {isPending ? "Switching…" : "Switch to BOT Chain"}
        </Button>
      </div>
    );
  }
  return <>{children}</>;
}
