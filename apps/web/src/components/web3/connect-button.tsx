"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { CHAIN } from "@/lib/config";
import { shortAddress } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useIsClient } from "@/hooks/use-is-client";

export function ConnectButton({ variant = "ghost" }: { variant?: "ghost" | "outline" }) {
  const mounted = useIsClient();
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

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
      onClick={() =>
        connector &&
        connect(
          { connector },
          // Wrong network right after connecting? Switch (wagmi adds BOT Chain if the wallet lacks it).
          { onSuccess: (res) => res.chainId !== CHAIN.id && switchChain({ chainId: CHAIN.id }) },
        )
      }
    >
      {isPending ? "Connecting…" : "Connect wallet"}
    </Button>
  );
}
