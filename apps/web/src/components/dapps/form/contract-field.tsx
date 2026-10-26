"use client";

import { isAddress } from "viem";
import { CHAIN, explorerAddressUrl } from "@/lib/config";
import type { ContractCheck } from "@/hooks/use-contract-check";
import { Chip } from "@/components/ui/chip";
import { IconCheck, IconExternal, IconSpinner, IconAlert } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { fieldProps, inputClass } from "./form-field";

function formatSize(bytes: number) {
  return bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`;
}

export function ContractField({
  value,
  onChange,
  onBlur,
  error,
  editing,
  check,
  loading,
  unavailable,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string | null;
  editing: boolean;
  check?: ContractCheck;
  loading: boolean;
  unavailable?: boolean;
}) {
  const parsed = isAddress(value);
  const valid = !!check && check.isContract && !check.isSelf && !check.isRegistry;
  const listed = check?.listedId != null;

  let checkError: string | null = null;
  if (!editing && parsed && !loading && check) {
    if (check.isSelf) checkError = "That's your wallet address, not a contract. Paste the dApp's contract.";
    else if (check.isRegistry) checkError = "That's the DeployDex registry itself. Paste your own contract.";
    else if (!check.isContract)
      checkError = CHAIN.testnet
        ? "No contract found at this address on BOT Chain testnet."
        : "No contract at this address on BOT Chain mainnet. Testnet addresses can't be listed here: use your dApp's mainnet contract.";
    else if (listed) checkError = "This contract is already listed.";
  }
  if (!editing && parsed && !loading && unavailable) {
    checkError = "Couldn't read BOT Chain. Check your connection and try again.";
  }
  const displayError = error ?? checkError;

  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor="target" className="text-sm font-medium">
          Contract address
        </label>
        <span className="font-mono text-[11px] text-muted">
          {CHAIN.name} · {CHAIN.id}
        </span>
      </div>

      {editing ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-panel px-4 py-3">
          <span className="font-mono text-sm break-all">{value}</span>
          <a
            href={explorerAddressUrl(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
          >
            Explorer <IconExternal className="size-3" />
          </a>
        </div>
      ) : (
        <input
          {...fieldProps("target", { error: displayError, hasHint: !displayError })}
          className={cn(inputClass, "font-mono")}
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          onBlur={onBlur}
          placeholder="0x…"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          inputMode="text"
        />
      )}

      <div className="min-h-4 text-xs leading-relaxed">
        {displayError ? (
          <p id="target-error" className="flex items-start gap-1.5 text-pink">
            <IconAlert className="mt-px size-3.5 shrink-0" />
            <span>
              <span className="sr-only">Error: </span>
              {displayError}{" "}
              {listed && check?.listedId != null && (
                <a className="underline" href={`/dapps/${check.listedId}`}>
                  Open the listing
                </a>
              )}
            </span>
          </p>
        ) : loading ? (
          <p className="inline-flex items-center gap-1.5 text-muted">
            <IconSpinner className="size-3.5" /> Reading bytecode on {CHAIN.name}…
          </p>
        ) : valid && check ? (
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="green">
              <IconCheck className="mr-1 size-3" /> Contract · {formatSize(check.codeSize)}
            </Chip>
            <a
              href={explorerAddressUrl(value)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-brand hover:underline"
            >
              Explorer <IconExternal className="size-3" />
            </a>
          </div>
        ) : (
          <p id="target-hint" className="text-muted">
            {editing
              ? "The contract address is locked after listing."
              : "Paste the address of a deployed contract on BOT Chain."}
          </p>
        )}
      </div>
    </div>
  );
}
