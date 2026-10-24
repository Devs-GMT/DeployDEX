import { z } from "zod";
import { getAddress, isAddress } from "viem";

/** Limits mirror the byte-length checks in contracts/DeployDex.sol. */
export const LIMITS = { name: 48, tagline: 80, url: 200, repo: 100 } as const;

export function byteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}

/** Accepts "owner/repo" or a github.com URL. Returns null when invalid. */
export function parseRepo(input: string): { owner: string; repo: string } | null {
  const cleaned = input
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/\.git$/i, "")
    .replace(/\/+$/, "");
  const match = /^([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/([A-Za-z0-9._-]{1,100})$/.exec(cleaned);
  return match?.[1] && match[2] ? { owner: match[1], repo: match[2] } : null;
}

const httpsUrl = z
  .string()
  .trim()
  .refine((v) => byteLength(v) <= LIMITS.url, `Max ${LIMITS.url} bytes`)
  .refine((v) => v.startsWith("https://") && URL.canParse(v), "Must be a valid https:// URL");

const nameField = z
  .string()
  .trim()
  .min(1, "Name is required")
  .refine((v) => byteLength(v) <= LIMITS.name, `Max ${LIMITS.name} bytes`);

const taglineField = z
  .string()
  .trim()
  .refine((v) => byteLength(v) <= LIMITS.tagline, `Max ${LIMITS.tagline} bytes`);

const targetField = z.string().refine((v): boolean => isAddress(v), "Enter a valid 0x address");

const repoField = z
  .string()
  .trim()
  .refine((v) => parseRepo(v) !== null, "Use owner/repo or a github.com URL")
  .refine((v) => byteLength(v) <= LIMITS.repo, `Max ${LIMITS.repo} bytes`);

export const dappFormSchema = z.object({
  name: nameField,
  tagline: taglineField,
  category: z.number().int().min(0).max(7),
  target: targetField,
  liveUrl: httpsUrl,
  repo: repoField,
  logoUrl: z.union([z.literal(""), httpsUrl]),
});

export type DappFormValues = z.infer<typeof dappFormSchema>;
export type FieldErrors = Partial<Record<keyof DappFormValues, string>>;

export const EMPTY_FORM: DappFormValues = {
  name: "",
  tagline: "",
  category: 0,
  target: "",
  liveUrl: "https://",
  repo: "",
  logoUrl: "",
};

/** Same rules as submit, so feedback can never disagree with the final validation. */
export function validateField<K extends keyof DappFormValues>(
  key: K,
  value: DappFormValues[K],
): string | null {
  const result = dappFormSchema.safeParse({ ...EMPTY_FORM, [key]: value });
  if (result.success) return null;
  const issue = result.error.issues.find((i) => i.path[0] === key);
  return issue?.message ?? null;
}

export function collectErrors(values: DappFormValues): FieldErrors {
  const parsed = dappFormSchema.safeParse(values);
  if (parsed.success) return {};
  const errors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof DappFormValues | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/** Display the checksummed form; falls back to the trimmed input when invalid. */
export function normalizeAddress(value: string): string {
  try {
    return getAddress(value.trim());
  } catch {
    return value.trim();
  }
}

/**
 * Anything read from the chain is untrusted: anyone can call the contract directly
 * and store a `javascript:` URL. Only plain https URLs (no credentials) may reach an href/src.
 */
export function safeHttpsUrl(value: string | undefined | null): string | null {
  if (!value || value.length > LIMITS.url || !URL.canParse(value)) return null;
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) return null;
  return url.toString();
}
