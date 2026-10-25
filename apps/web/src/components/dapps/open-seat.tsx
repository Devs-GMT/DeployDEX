import { Kit, type KitPose } from "@/components/kit/kit";
import { ButtonLink } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * An open seat on the shelf: a dashed tile inviting builders to list. Used to fill short
 * rows so a young registry reads as "room to grow" rather than "empty".
 * `compact` drops the copy and shrinks Kit, for filler seats after the first.
 */
export function OpenSeat({
  compact = false,
  pose = "dev",
  className,
}: {
  compact?: boolean;
  pose?: KitPose;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group kit-group border-ink/20 hover:border-brand relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border-2 border-dashed p-6 text-center transition-colors",
        compact ? "min-h-56" : "min-h-80",
        className,
      )}
    >
      <div aria-hidden className={compact ? "w-20 opacity-80" : "w-32"}>
        <Kit pose={pose} sizes={compact ? "80px" : "128px"} />
      </div>
      <h3 className={compact ? "text-lg" : "text-xl"}>This seat is open.</h3>
      {!compact && (
        <p className="text-muted max-w-60 text-sm">
          Shipped something on BOT Chain? List it in a minute and only pay gas.
        </p>
      )}
      <ButtonLink
        href="/list"
        size="sm"
        variant={compact ? "secondary" : "primary"}
        className="mt-1 after:absolute after:inset-0 after:content-['']"
      >
        List your dApp <IconArrowRight />
      </ButtonLink>
    </div>
  );
}
