import { type Address, isAddress } from "viem";
import { botChain, botChainTestnet } from "./chains";

const ZERO = "0x0000000000000000000000000000000000000000" as const;

function toAddress(value: string | undefined): Address {
  return value && isAddress(value) ? value : ZERO;
}

const isMainnet = process.env.NEXT_PUBLIC_CHAIN === "mainnet";

/** Single source of truth for the registry address and active chain. */
export const CHAIN = isMainnet ? botChain : botChainTestnet;
export const REGISTRY_ADDRESS: Address = isMainnet
  ? toAddress(process.env.NEXT_PUBLIC_REGISTRY_MAINNET)
  : toAddress(process.env.NEXT_PUBLIC_REGISTRY_TESTNET);
export const MAINNET_REGISTRY_ADDRESS = toAddress(process.env.NEXT_PUBLIC_REGISTRY_MAINNET);
export const REGISTRY_DEPLOYED = REGISTRY_ADDRESS !== ZERO;

export const EXPLORER_URL = CHAIN.blockExplorers.default.url;
export const explorerAddressUrl = (address: string) => `${EXPLORER_URL}/address/${address}`;
export const BOT_CHAIN_SITE = "https://botchain.ai";

/** Public site URL for sitemap/OG. Set NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Kit uses the HD 3D renders in /public/kit by default. Set NEXT_PUBLIC_KIT_RASTER=0 for the vector Kit. */
export const KIT_RASTER = process.env.NEXT_PUBLIC_KIT_RASTER !== "0";
