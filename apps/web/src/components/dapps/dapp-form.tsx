"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { LIMITS, dappFormSchema, parseRepo, type DappFormValues } from "@/lib/validators";
import { useContractCheck } from "@/hooks/use-contract-check";
import { useGithubRepo } from "@/hooks/use-github-repo";
import { useRegistryWrite } from "@/hooks/use-registry-write";
import { Button } from "@/components/ui/button";
import { WalletGate } from "@/components/web3/wallet-gate";
import { Kit } from "@/components/kit/kit";
import { isAddress } from "viem";
import { REGISTRY_DEPLOYED } from "@/lib/config";

type Mode = { kind: "create" } | { kind: "edit"; id: number };

const EMPTY: DappFormValues = {
  name: "",
  tagline: "",
  category: 0,
  target: "",
  liveUrl: "https://",
  repo: "",
  logoUrl: "",
};

const inputClass =
  "mt-1 h-11 w-full rounded-xl border border-line bg-card px-4 text-sm disabled:bg-panel disabled:text-muted";

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {children}
      {hint && !error && <span className="mt-1 block text-xs font-normal text-muted">{hint}</span>}
      {error && <span role="alert" className="mt-1 block text-xs font-normal text-pink">{error}</span>}
    </label>
  );
}

function Check({ ok, pending, children }: { ok: boolean | null; pending?: boolean; children: ReactNode }) {
  const icon = pending ? "…" : ok === null ? "○" : ok ? "✓" : "✕";
  const color = pending || ok === null ? "text-muted" : ok ? "text-[#14693a]" : "text-pink";
  return (
    <li className={`flex gap-2 text-sm ${color}`}>
      <span aria-hidden className="w-4 font-mono">{icon}</span>
      <span>{children}</span>
    </li>
  );
}

export function DappForm({ mode, initial }: { mode: Mode; initial?: DappFormValues }) {
  const editing = mode.kind === "edit";
  const [values, setValues] = useState<DappFormValues>(initial ?? EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof DappFormValues, string>>>({});
  const { state, run, reset } = useRegistryWrite();

  const set = <K extends keyof DappFormValues>(key: K, value: DappFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const contract = useContractCheck(editing ? "" : values.target);
  const gh = useGithubRepo(values.repo);
  const addressValid = isAddress(values.target);
  const ghResult = gh.data;
  const httpsOk = values.liveUrl.startsWith("https://") && URL.canParse(values.liveUrl);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = dappFormSchema.safeParse(values);
    if (!parsed.success) {
      const next: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof DappFormValues;
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    const v = parsed.data;
    const fields = [v.name, v.tagline, v.category, v.liveUrl, v.repo, v.logoUrl] as const;
    await run(editing ? "update" : "list", editing ? [BigInt(mode.id), ...fields] : [v.target, ...fields]);
  }

  if (state.status === "success") {
    const text = encodeURIComponent(`I just listed ${values.name} on DeployDex — the home of BOT Chain dApps. Ship it. List it. Get starred. @BOTChain_ai`);
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-line bg-card p-10 text-center" role="status">
        <Kit pose="party" className="w-44" />
        <h2 className="text-2xl">{editing ? "Listing updated!" : "Your dApp is live in the Dex!"}</h2>
        <div className="flex flex-wrap justify-center gap-2">
          <a
            className="inline-flex h-11 items-center rounded-xl bg-ink px-5 text-sm font-medium text-white"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://twitter.com/intent/tweet?text=${text}`}
          >
            Share on X
          </a>
          <Link href="/my" className="inline-flex h-11 items-center rounded-xl border border-line px-5 text-sm font-medium">
            My dApps
          </Link>
        </div>
      </div>
    );
  }

  const canSubmit =
    REGISTRY_DEPLOYED &&
    state.status !== "pending" &&
    (editing || (contract.data?.isContract === true && contract.data.listedId === null));

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_280px]" noValidate>
      <div className="grid gap-5 rounded-xl border border-line bg-card p-6">
        <Field label="Name" error={errors.name}>
          <input className={inputClass} value={values.name} maxLength={LIMITS.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Tagline" error={errors.tagline} hint={`${values.tagline.length}/${LIMITS.tagline}`}>
          <input className={inputClass} value={values.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <Field label="Category">
          <select className={inputClass} value={values.category} onChange={(e) => set("category", Number(e.target.value))}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Contract address" error={errors.target} hint={editing ? "The contract address can't be changed." : undefined}>
          <input
            className={`${inputClass} font-mono`}
            value={values.target}
            disabled={editing}
            placeholder="0x…"
            spellCheck={false}
            onChange={(e) => set("target", e.target.value.trim())}
          />
        </Field>
        <Field label="Live URL" error={errors.liveUrl}>
          <input className={inputClass} value={values.liveUrl} onChange={(e) => set("liveUrl", e.target.value.trim())} />
        </Field>
        <Field label="GitHub repo" error={errors.repo} hint="owner/repo or a github.com URL">
          <input className={inputClass} value={values.repo} onChange={(e) => set("repo", e.target.value.trim())} />
        </Field>
        <Field label="Logo image URL (optional)" error={errors.logoUrl}>
          <input className={inputClass} value={values.logoUrl} placeholder="https://…" onChange={(e) => set("logoUrl", e.target.value.trim())} />
        </Field>

        <WalletGate prompt="Connect your wallet to list.">
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" size="lg" disabled={!canSubmit}>
              {state.status === "pending" ? "Confirm in wallet…" : editing ? "Save changes" : "List on BOT Chain"}
            </Button>
            {state.status === "error" && (
              <span role="alert" className="text-sm text-pink">
                {state.message}{" "}
                <button type="button" className="underline" onClick={reset}>Dismiss</button>
              </span>
            )}
          </div>
        </WalletGate>
      </div>

      <aside className="h-fit rounded-xl border border-line bg-card p-6" aria-live="polite">
        <Kit pose="inspector" className="mx-auto w-32" />
        <h2 className="mt-2 text-lg">Checking your contract…</h2>
        <ul className="mt-3 space-y-2">
          {!editing && (
            <>
              <Check
                ok={!addressValid ? null : contract.data ? contract.data.isContract : null}
                pending={addressValid && contract.isLoading}
              >
                {contract.data && !contract.data.isContract
                  ? "This address has no contract on BOT Chain"
                  : "Address is a deployed contract on BOT Chain"}
              </Check>
              <Check
                ok={contract.data ? contract.data.listedId === null : null}
                pending={addressValid && contract.isLoading}
              >
                {contract.data?.listedId != null ? (
                  <>Already listed — <Link className="underline" href={`/dapps/${contract.data.listedId}`}>see listing</Link></>
                ) : (
                  "Not already listed"
                )}
              </Check>
            </>
          )}
          <Check
            ok={!parseRepo(values.repo) ? null : ghResult ? ghResult.state === "ok" : null}
            pending={!!parseRepo(values.repo) && gh.isLoading}
          >
            {ghResult?.state === "ok"
              ? `GitHub repo found: ${ghResult.repo.name}`
              : ghResult?.state === "not_found"
                ? "Repo not found or private"
                : ghResult?.state === "rate_limited"
                  ? "GitHub is taking a nap — we'll check again on listing"
                  : "GitHub repo exists and is public"}
          </Check>
          <Check ok={values.liveUrl === "https://" ? null : httpsOk}>Live URL starts with https://</Check>
        </ul>
        {ghResult?.state === "ok" && ghResult.repo.description && (
          <p className="mt-3 text-xs text-muted">{ghResult.repo.description}</p>
        )}
        {state.status === "pending" && <p className="mt-4 text-xs text-muted">Waiting for the transaction to confirm…</p>}
      </aside>
    </form>
  );
}
