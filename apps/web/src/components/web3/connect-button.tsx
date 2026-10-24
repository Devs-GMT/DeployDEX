"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortAddress } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useIsClient } from "@/hooks/use-is-client";

export function ConnectButton({ variant = "ghost" }: { variant?: "ghost" | "outline" }) {
  const mounted = useIsClient();
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (!mounted)
    return (
      <Button variant={variant} size="sm" disabled>
        Connect wallet
      </Button>
    );

  if (isConnected && address) {
    return (
      <Button
        variant={variant}
        size="sm"
        onClick={() => disconnect()}
        title="Disconnect"
        className="font-mono"
      >
        {shortAddress(address)}
      </Button>
    );
  }

  if (!("ethereum" in window)) {
    return (
      <a
        href="https://metamask.io/download/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium hover:text-brand"
      >
        Install MetaMask
      </a>
    );
  }

  const connector = connectors[0];
  return (
    <Button
      variant={variant}
      size="sm"
      disabled={isPending || !connector}
      onClick={() => connector && connect({ connector })}
    >
      {isPending ? "Connecting…" : "Connect wallet"}
    </Button>
  );
}
