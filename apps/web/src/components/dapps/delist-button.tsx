"use client";

import { useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import { TxPending } from "@/components/web3/tx-pending";
import { useRegistryWrite } from "@/hooks/use-registry-write";
import { CHAIN } from "@/lib/config";
import type { Dapp } from "@/lib/types";

/**
 * Lister-only "take it out of the Dex" control. Asks once in plain words before the wallet does,
 * because delisting can't be undone (the contract can be listed again, as a new listing).
 */
export function DelistButton({ dapp }: { dapp: Dapp }) {
  const { chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { state, run, reset } = useRegistryWrite();
  const [confirming, setConfirming] = useState(false);
  const [switchError, setSwitchError] = useState<string | null>(null);

  async function delist() {
    setSwitchError(null);
    if (chainId !== CHAIN.id) {
      try {
        await switchChainAsync({ chainId: CHAIN.id });
      } catch {
        setSwitchError("Switch to BOT Chain to delist.");
        return;
      }
    }
    void run("delist", [BigInt(dapp.id)]);
  }

  if (!confirming) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-muted hover:text-pink-deep w-full"
        onClick={() => setConfirming(true)}
      >
        Delist
      </Button>
    );
  }

  const pending = state.status === "pending";
  return (
    <div
      role="group"
      aria-label={`Delist ${dapp.name}`}
      className="border-pink-line bg-pink-wash/60 space-y-3 rounded-xl border p-3 text-sm"
    >
      <p>
        <strong className="font-medium">Take {dapp.name} out of the Dex?</strong>{" "}
        <span className="text-muted">
          This can&apos;t be undone. The record stays on-chain, and the contract can be listed
          again later as a new listing.
        </span>
      </p>
      {pending ? (
        <TxPending label="Confirm in your wallet, then we check the chain…" />
      ) : (
        <div className="flex gap-2">
          <Button
            variant="light"
            size="sm"
            className="flex-1"
            onClick={() => {
              reset();
              setConfirming(false);
            }}
          >
            Keep it
          </Button>
          <Button
            size="sm"
            className="border-pink-deep bg-pink hover:bg-pink-deep flex-1"
            onClick={() => void delist()}
          >
            Delist for good
          </Button>
        </div>
      )}
      {(state.status === "error" || switchError) && (
        <p role="alert" className="text-pink-deep text-xs">
          {switchError ?? (state.status === "error" ? state.message : null)}
        </p>
      )}
    </div>
  );
}
