"use client";

import { Button } from "@/components/ui/button";
import { IconCheck } from "@/components/ui/icons";
import { WalletGate } from "@/components/web3/wallet-gate";
import { TxPending } from "@/components/web3/tx-pending";
import type { TxState } from "@/hooks/use-registry-write";

export function FormSubmit({
  editing,
  pending,
  tx,
  problems,
  attempted,
  resetTx,
}: {
  editing: boolean;
  pending: boolean;
  tx: TxState;
  problems: number;
  attempted: boolean;
  resetTx: () => void;
}) {
  return (
    <div className="border-line bg-card grid gap-3 rounded-2xl border p-5 sm:p-6">
      <WalletGate prompt="Connect a wallet to list on BOT Chain.">
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Confirm in wallet…" : editing ? "Save changes" : "List on BOT Chain"}
          </Button>
          {attempted && problems > 0 && (
            <p className="text-pink text-sm">
              {problems} {problems === 1 ? "check" : "checks"} still need you.
            </p>
          )}
          {tx.status === "error" && (
            <p role="alert" className="text-pink text-sm">
              {tx.message}{" "}
              <button type="button" className="underline" onClick={resetTx}>
                Dismiss
              </button>
            </p>
          )}
        </div>
      </WalletGate>
      <p className="text-muted flex items-center gap-1.5 text-xs">
        <IconCheck className="text-success size-3.5" />
        You stay in control: the transaction is only sent after you confirm it in your wallet.
      </p>
      {pending && <TxPending label={editing ? "Saving changes" : "Listing your dApp"} />}
    </div>
  );
}
