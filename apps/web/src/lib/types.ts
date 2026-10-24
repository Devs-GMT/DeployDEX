import type { Address } from "viem";

export interface Dapp {
  id: number;
  lister: Address;
  target: Address;
  name: string;
  tagline: string;
  category: number;
  liveUrl: string;
  repo: string;
  logoUrl: string;
  stars: number;
  hidden: boolean;
  listedAt: number;
  updatedAt: number;
}
