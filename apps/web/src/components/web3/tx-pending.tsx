import { Kit } from "@/components/kit/kit";

/** Inspector Kit shown while a transaction is waiting for a wallet signature or confirmation. */
export function TxPending({ label = "Checking your transaction…" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-3 rounded-xl border border-line bg-card p-3 text-sm shadow-sm">
      <Kit pose="inspector" className="w-14 shrink-0" float />
      <span>{label}</span>
    </div>
  );
}
