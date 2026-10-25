"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import {
  EMPTY_FORM,
  collectErrors,
  dappFormSchema,
  normalizeAddress,
  validateField,
  type DappFormValues,
  type FieldErrors,
} from "@/lib/validators";
import { REGISTRY_DEPLOYED } from "@/lib/config";
import { useContractCheck } from "@/hooks/use-contract-check";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useGithubRepo } from "@/hooks/use-github-repo";
import { useRegistryWrite } from "@/hooks/use-registry-write";
import type { CheckItem } from "@/components/dapps/form/form-checks";

export type FormMode = { kind: "create" } | { kind: "edit"; id: number };

export interface FieldIssue {
  key: keyof DappFormValues;
  label: string;
  message: string;
}

const LABELS: Record<keyof DappFormValues, string> = {
  name: "Name",
  tagline: "Tagline",
  category: "Category",
  target: "Contract address",
  liveUrl: "Live URL",
  repo: "GitHub repo",
  logoUrl: "Logo image URL",
};

export function useDappForm({ mode, initial }: { mode: FormMode; initial?: DappFormValues }) {
  const editing = mode.kind === "edit";
  const { address } = useAccount();
  const [initialProblems] = useState<FieldErrors>(() =>
    editing && initial ? collectErrors(initial) : {},
  );
  const [values, setValues] = useState<DappFormValues>(initial ?? EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>(initialProblems);
  const [attempted, setAttempted] = useState(false);

  const { state: tx, run, reset } = useRegistryWrite();

  const debouncedRepo = useDebouncedValue(values.repo, 350);
  const contract = useContractCheck(editing ? "" : values.target, address);
  const gh = useGithubRepo(debouncedRepo);

  const repoSettled = debouncedRepo === values.repo;
  const repoLoading = gh.isFetching || !repoSettled;
  const contractLoading = contract.isFetching;
  const contractError = contract.isError;
  const targetParsed = isAddress(values.target);

  const contractProblem = (() => {
    if (editing || !targetParsed) return null;
    if (contractLoading || !contract.data) return null;
    if (contract.data.isSelf) return "That's your wallet address, not a contract.";
    if (contract.data.isRegistry) return "That's the DeployDex registry itself.";
    if (!contract.data.isContract) return "No contract found at this address on BOT Chain.";
    if (contract.data.listedId != null) return "This contract is already listed.";
    return null;
  })();

  const contractOk =
    editing ||
    (!!contract.data &&
      contract.data.isContract &&
      !contract.data.isSelf &&
      !contract.data.isRegistry &&
      contract.data.listedId === null);
  const repoOk = gh.data?.state === "ok" || gh.data?.state === "rate_limited";

  function update<K extends keyof DappFormValues>(key: K, value: DappFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const message = validateField(key, value);
      const next = { ...prev };
      if (message) next[key] = message;
      else delete next[key];
      return next;
    });
  }

  function markTouched(key: keyof DappFormValues) {
    let value = values[key];
    if (key === "target") {
      const normalized = normalizeAddress(values.target);
      if (normalized !== values.target) {
        setValues((v) => ({ ...v, target: normalized }));
        value = normalized;
      }
    }
    const message = validateField(key, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[key] = message;
      else delete next[key];
      return next;
    });
  }

  /** Live, non-schema problems — same list the checks panel shows. */
  function liveIssues(): FieldIssue[] {
    const issues: FieldIssue[] = [];
    if (!REGISTRY_DEPLOYED) {
      return [
        {
          key: "target",
          label: "Registry",
          message: "The registry isn't deployed on this chain yet.",
        },
      ];
    }
    if (!editing) {
      if (!targetParsed) {
        issues.push({ key: "target", label: LABELS.target, message: "Enter a valid 0x address." });
      } else if (contractLoading) {
        issues.push({
          key: "target",
          label: LABELS.target,
          message: "Still checking the contract — try again in a moment.",
        });
      } else if (contractError) {
        issues.push({
          key: "target",
          label: LABELS.target,
          message: "Couldn't read BOT Chain. Check your connection and retry.",
        });
      } else if (contractProblem) {
        issues.push({ key: "target", label: LABELS.target, message: contractProblem });
      }
    }
    if (values.repo && (!repoSettled || gh.isFetching)) {
      issues.push({
        key: "repo",
        label: LABELS.repo,
        message: "Still looking up the repo — try again in a moment.",
      });
    } else if (gh.data?.state === "not_found") {
      issues.push({ key: "repo", label: LABELS.repo, message: "Repo not found or private." });
    }
    return issues;
  }

  /** Merge schema errors with live checks — recomputed on every render after the first submit. */
  function collectProblems(): FieldIssue[] {
    const merged = new Map<keyof DappFormValues, FieldIssue>();
    for (const [key, message] of Object.entries(collectErrors(values))) {
      const k = key as keyof DappFormValues;
      merged.set(k, { key: k, label: LABELS[k], message: message! });
    }
    for (const issue of liveIssues()) {
      if (!merged.has(issue.key)) merged.set(issue.key, issue);
    }
    return [...merged.values()];
  }

  const problems = attempted ? collectProblems() : [];

  const contractCheck: CheckItem = editing
    ? { id: "contract", label: "Contract stays as listed", state: "ok" }
    : !values.target
      ? { id: "contract", label: "Deployed contract on BOT Chain", state: "idle" }
      : !targetParsed
        ? {
            id: "contract",
            label: "Deployed contract on BOT Chain",
            state: "idle",
            detail: "Waiting for a valid address",
          }
        : contractLoading
          ? { id: "contract", label: "Reading contract bytecode…", state: "checking" }
          : contractError
            ? {
                id: "contract",
                label: "Couldn't read BOT Chain",
                state: "error",
                detail: "Check your connection and retry.",
              }
            : contractOk
              ? {
                  id: "contract",
                  label: "Contract is live",
                  state: "ok",
                  detail: contract.data?.codeSize
                    ? `${contract.data.codeSize.toLocaleString()} bytes of bytecode`
                    : undefined,
                }
              : {
                  id: "contract",
                  label: contractProblem ?? "Contract check failed",
                  state: "error",
                };

  const listedCheck: CheckItem = editing
    ? { id: "listed", label: "Editing your existing listing", state: "ok" }
    : !contract.data || !contract.data.isContract || contractLoading
      ? { id: "listed", label: "Not already listed", state: "idle" }
      : contract.data.listedId != null
        ? {
            id: "listed",
            label: "Already listed",
            state: "error",
            detail: "Edit it from My dApps instead.",
          }
        : { id: "listed", label: "Not already listed", state: "ok" };

  const repoCheck: CheckItem = !values.repo
    ? { id: "repo", label: "Public GitHub repo", state: "idle" }
    : !repoSettled || gh.isFetching
      ? { id: "repo", label: "Looking up repo…", state: "checking" }
      : gh.data?.state === "ok"
        ? { id: "repo", label: "Repo found", state: "ok", detail: gh.data.repo.name }
        : gh.data?.state === "not_found"
          ? { id: "repo", label: "Repo not found or private", state: "error" }
          : gh.data?.state === "rate_limited"
            ? {
                id: "repo",
                label: "GitHub is rate-limited",
                state: "warn",
                detail: "You can still list — we'll link the repo by name.",
              }
            : { id: "repo", label: "Public GitHub repo", state: "idle" };

  const urlError = validateField("liveUrl", values.liveUrl);
  const urlCheck: CheckItem =
    values.liveUrl === "https://" || !values.liveUrl
      ? { id: "url", label: "Live URL uses https://", state: "idle" }
      : urlError
        ? { id: "url", label: "Live URL needs a valid https:// link", state: "error" }
        : { id: "url", label: "Live URL uses https://", state: "ok" };

  const checks = editing
    ? [repoCheck, urlCheck]
    : [contractCheck, listedCheck, repoCheck, urlCheck];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const base = collectErrors(values);
    const found = collectProblems();
    if (found.length) {
      setErrors(base);
      setAttempted(true);
      requestAnimationFrame(() => document.getElementById("form-errors")?.focus());
      return;
    }
    setAttempted(false);
    const parsed = dappFormSchema.parse(values);
    const v = { ...parsed, target: normalizeAddress(parsed.target) };
    const fields = [v.name, v.tagline, v.category, v.liveUrl, v.repo, v.logoUrl] as const;
    await run(
      editing ? "update" : "list",
      editing && mode.kind === "edit" ? [BigInt(mode.id), ...fields] : [v.target, ...fields],
    );
  }

  return {
    editing,
    editNeedsAttention: editing && Object.keys(initialProblems).length > 0,
    values,
    errors,
    update,
    markTouched,
    submit,
    problems,
    attempted,
    checks,
    contractData: contract.data,
    contractLoading,
    contractError,
    contractProblem,
    contractOk,
    repoData: gh.data,
    repoLoading,
    repoOk,
    tx,
    resetTx: reset,
  };
}

export type DappFormState = ReturnType<typeof useDappForm>;
