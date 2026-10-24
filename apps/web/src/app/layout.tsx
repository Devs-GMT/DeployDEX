import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/web3/providers";
import { TopBanner } from "@/components/layout/top-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: "italic" });
const space = Space_Grotesk({ variable: "--font-space", subsets: ["latin"], weight: ["500"] });

export const metadata: Metadata = {
  title: { default: "DeployDex — the home of BOT Chain dApps", template: "%s · DeployDex" },
  description:
    "An on-chain directory where every listing points to a real BOT Chain contract. List your dApp, get discovered, get starred.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${space.variable} ${instrument.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          <TopBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
