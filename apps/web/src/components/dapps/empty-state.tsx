import type { ReactNode } from "react";
import { Kit, type KitPose } from "@/components/kit/kit";
import { ButtonLink } from "@/components/ui/button";

export function EmptyState({
  title = "No dApps here yet — be the first!",
  body,
  pose = "napping",
  action = true,
}: {
  title?: string;
  body?: ReactNode;
  pose?: KitPose;
  action?: boolean;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <Kit pose={pose} className="w-40" />
      <h2 className="text-xl">{title}</h2>
      {body && <p className="text-sm text-muted">{body}</p>}
      {action && <ButtonLink href="/list">List your dApp</ButtonLink>}
    </div>
  );
}
