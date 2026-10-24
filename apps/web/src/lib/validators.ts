import { z } from "zod";
import { isAddress } from "viem";

export const LIMITS = { name: 48, tagline: 80, url: 200, repo: 100 } as const;

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
  .max(LIMITS.url, "Too long")
  .refine((v) => v.startsWith("https://") && URL.canParse(v), "Must be a valid https:// URL");

export const dappFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(LIMITS.name, `Max ${LIMITS.name} characters`),
  tagline: z.string().trim().max(LIMITS.tagline, `Max ${LIMITS.tagline} characters`),
  category: z.number().int().min(0).max(7),
  target: z.string().refine((v): boolean => isAddress(v), "Enter a valid 0x address"),
  liveUrl: httpsUrl,
  repo: z
    .string()
    .trim()
    .refine((v) => parseRepo(v) !== null, "Use owner/repo or a github.com URL"),
  logoUrl: z.union([z.literal(""), httpsUrl]),
});

export type DappFormValues = z.infer<typeof dappFormSchema>;
