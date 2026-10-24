import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Official BOT Chain wordmark (/public/brand/botchainlogo.png). The artwork has white text on a
 * transparent background, so it always sits on a dark chip to stay readable.
 */
export function BotChainLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-lg bg-charcoal px-3 py-2", className)}>
      <Image src="/brand/botchainlogo.png" alt="BOT Chain" width={409} height={80} className="h-5 w-auto" />
    </span>
  );
}
