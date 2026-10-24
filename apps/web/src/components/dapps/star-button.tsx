"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import { TxPending } from "@/components/web3/tx-pending";
import { Kit } from "@/components/kit/kit";
import { useIsStarred } from "@/hooks/use-projects";
import { useRegistryWrite } from "@/hooks/use-registry-write";
import { useIsClient } from "@/hooks/use-is-client";
import { CHAIN } from "@/lib/config";
import type { Dapp } from "@/lib/types";

const METAMASK_URL = "https://metamask.io/download/";

export function StarButton({ dapp, size = "sm" }: { dapp: Dapp; size?: "sm" | "md" }) {
  const mounted = useIsClient();
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { switchChainAsync } = useSwitchChain();
  const { data: starred } = useIsStarred(dapp.id, address);
  const { state, run, reset } = useRegistryWrite();
  const [party, setParty] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const lastAction = useRef<"star" | "unstar">("star");

  // Party Kit moment after a successful star.
  useEffect(() => {
    if (state.status === "success" && lastAction.current === "star") {
      setParty(true);
      const t = setTimeout(() => {
        setParty(false);
        reset();
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [state.status, reset]);

  if (mounted && address && address.toLowerCase() === dapp.lister.toLowerCase()) {
    return <span className="text-muted px-2 text-sm">Your project</span>;
  }

  const pending = state.status === "pending";
  const action = starred ? "unstar" : "star";
  const hasProvider = mounted && "ethereum" in window;

  async function handleAction() {
    setAuthError(null);
    const needsConnect = !isConnected;
    if (needsConnect || chainId !== CHAIN.id) {
      const connector = connectors[0];
      if (!hasProvider || !connector) {
        setAuthError("MetaMask not found.");
        return;
      }
      setAuthBusy(true);
      try {
        if (needsConnect) {
          const result = await connectAsync({ connector });
          if (result.accounts.some((a) => a.toLowerCase() === dapp.lister.toLowerCase())) {
            setAuthError("You can't star your own project.");
            setAuthBusy(false);
            return;
          }
          if (result.chainId !== CHAIN.id) await switchChainAsync({ chainId: CHAIN.id });
        } else {
          await switchChainAsync({ chainId: CHAIN.id });
        }
      } catch {
        setAuthError(needsConnect ? "Wallet connection cancelled." : "Switch cancelled.");
        setAuthBusy(false);
        return;
      }
      setAuthBusy(false);
    }
    lastAction.current = action;
    void run(action, [BigInt(dapp.id)]);
  }

  return (
    <div className="relative flex flex-col items-end gap-1">
      <Button
        variant={starred ? "outline" : "primary"}
        size={size}
        disabled={pending || authBusy}
        onClick={() => void handleAction()}
      >
        {pending
          ? "Waiting…"
          : authBusy
            ? isConnected
              ? "Switching…"
              : "Connecting…"
            : starred
              ? "Unstar"
              : "⭐ Star"}
      </Button>
      {pending && (
        <div className="absolute top-full right-0 z-20 mt-2 w-60">
          <TxPending label="Confirm in your wallet, then we check the chain…" />
        </div>
      )}
      {party && (
        <div
          role="status"
          className="border-line absolute top-full right-0 z-20 mt-2 flex w-56 items-center gap-2 rounded-xl border bg-white p-3 text-sm shadow-lg"
        >
          <Kit pose="party" className="w-14 shrink-0" />
          <span>Starred! Kit says thanks.</span>
        </div>
      )}
      {state.status === "error" && (
        <span role="alert" className="text-pink max-w-48 text-right text-xs">
          {state.message}
        </span>
      )}
      {authError && (
        <span role="alert" className="text-pink max-w-48 text-right text-xs">
          {authError}{" "}
          {!hasProvider && (
            <a href={METAMASK_URL} target="_blank" rel="noopener noreferrer" className="underline">
              Install
            </a>
          )}
        </span>
      )}
    </div>
  );
}
