import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { botChain, botChainTestnet } from "./chains";

// Both chains are registered so a wallet on either is recognised; the app only uses CHAIN (see config.ts).
export const wagmiConfig = createConfig({
  chains: [botChain, botChainTestnet],
  connectors: [injected({ target: "metaMask" })],
  transports: { [botChain.id]: http(), [botChainTestnet.id]: http() },
  ssr: true,
});
