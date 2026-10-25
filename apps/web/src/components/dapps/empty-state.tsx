import type { ReactNode } from "react";
import { Kit, type KitPose } from "@/components/kit/kit";
import { ButtonLink } from "@/components/ui/button";

export function EmptyState({
  title = "No dApps here yet — be the first!",
  body,
  pose = "napping",
  action = true,
  extra,
}: {
  title?: string;
  body?: ReactNode;
  pose?: KitPose;
  action?: boolean;
  /** Extra control under the copy, e.g. "Clear filters". */
  extra?: ReactNode;
}) {
  return (
    <div className="kit-group mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <Kit pose={pose} className="w-48" sizes="192px" />
      <h2 className="mt-2 text-2xl">{title}</h2>
      {body && <p className="text-muted text-sm leading-relaxed">{body}</p>}
      {extra}
      {action && <ButtonLink href="/list">List your dApp</ButtonLink>}
    </div>
  );
}
