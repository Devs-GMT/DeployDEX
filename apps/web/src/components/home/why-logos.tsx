"use client";

import Link from "next/link";
import { useProjects } from "@/hooks/use-projects";
import { LogoAvatar } from "@/components/dapps/logo-avatar";

/** Row of real listed projects under the comparison. Renders nothing until listings exist. */
export function WhyLogos() {
  const { data } = useProjects();
  if (!data || data.length === 0) return null;
  return (
    <div className="reveal mt-12 flex flex-wrap items-center justify-center gap-3" aria-label="Projects already listed">
      {data.slice(0, 10).map((d) => (
        <Link key={d.id} href={`/dapps/${d.id}`} title={d.name} className="rounded-xl transition-transform hover:-translate-y-0.5">
          <LogoAvatar name={d.name} src={d.logoUrl} category={d.category} className="size-12 border-white/20" />
        </Link>
      ))}
    </div>
  );
}
