import { isAddress } from "viem";
import { z } from "zod";
import { EXPLORER_URL } from "@/lib/config";

/**
 * GET /api/verify/<address>
 * Reads the BOT Chain explorer (Blockscout API v2) for a listing's target contract: is its
 * source verified, and which wallet deployed it. Returns
 * `{ verified, name, compiler, verifiedAt, creator }`, or `{ error }` when the explorer is down.
 */

const TIMEOUT_MS = 6_000;

const contractSchema = z.object({
  is_verified: z.boolean().nullish(),
  is_fully_verified: z.boolean().nullish(),
  name: z.string().nullish(),
  compiler_version: z.string().nullish(),
  verified_at: z.string().nullish(),
});

const addressSchema = z.object({
  is_contract: z.boolean().nullish(),
  creator_address_hash: z.string().nullish(),
});

async function explorer(path: string): Promise<{ status: number; body: unknown } | null> {
  try {
    const res = await fetch(`${EXPLORER_URL}/api/v2/${path}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: 3600 },
    });
    const body: unknown = res.ok ? await res.json() : null;
    return { status: res.status, body };
  } catch {
    return null;
  }
}

export async function GET(_req: Request, ctx: RouteContext<"/api/verify/[address]">) {
  const { address } = await ctx.params;
  if (!isAddress(address)) return Response.json({ error: "invalid" }, { status: 400 });

  const [contract, info] = await Promise.all([
    explorer(`smart-contracts/${address}`),
    explorer(`addresses/${address}`),
  ]);
  // 404 on smart-contracts just means "no verified source"; anything else unanswered is an outage.
  if (!contract || !info || (contract.status !== 200 && contract.status !== 404) || info.status !== 200) {
    return Response.json({ error: "unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  const c = contractSchema.safeParse(contract.body ?? {});
  const a = addressSchema.safeParse(info.body);
  const creator = a.success && a.data.creator_address_hash && isAddress(a.data.creator_address_hash)
    ? a.data.creator_address_hash
    : null;
  const verified = c.success && !!(c.data.is_verified ?? c.data.is_fully_verified);

  return Response.json(
    {
      verified,
      name: verified && c.success ? (c.data.name ?? null) : null,
      compiler: verified && c.success ? (c.data.compiler_version ?? null) : null,
      verifiedAt: verified && c.success ? (c.data.verified_at ?? null) : null,
      creator,
    },
    {
      // Verified source rarely changes back; an unverified answer is retried sooner.
      headers: {
        "Cache-Control": `public, s-maxage=${verified ? 86_400 : 900}, stale-while-revalidate=86400`,
      },
    },
  );
}
