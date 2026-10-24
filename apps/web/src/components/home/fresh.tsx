"use client";

import { useProjects } from "@/hooks/use-projects";
import { DappCard } from "@/components/dapps/dapp-card";
import { EmptyState } from "@/components/dapps/empty-state";
import { REGISTRY_DEPLOYED } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { Em, Section, SectionHead } from "@/components/ui/frame";
import { FlyingKit } from "@/components/ui/decor";
import { Kit } from "@/components/kit/kit";

export function Fresh() {
  const { data, isLoading } = useProjects();
  const items = [...(data ?? [])].sort((a, b) => b.listedAt - a.listedAt).slice(0, 8);

  return (
    <Section>
      <div
        aria-hidden
        className="pointer-events-none absolute top-24 -left-3 hidden w-24 opacity-80 lg:block"
      >
        <Kit pose="astro" float />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute top-56 right-0 hidden w-20 opacity-70 xl:block"
      >
        <Kit pose="astro" className="[animation-delay:-2.5s]" float />
      </div>
      <SectionHead
        title={
          <>
            Fresh <Em>deploys</Em>
          </>
        }
        sub="The newest listings, straight off the chain."
        action={
          <ButtonLink href="/dapps?s=new" variant="secondary">
            See all →
          </ButtonLink>
        }
      />
      <div className="mt-12">
        {isLoading && REGISTRY_DEPLOYED ? (
          <p className="text-muted py-10 text-center text-sm" role="status">
            Loading…
          </p>
        ) : items.length === 0 ? (
          <div className="dot-grid border-line bg-card/60 rounded-3xl border border-dashed">
            <EmptyState />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((d) => (
              <DappCard key={d.id} dapp={d} />
            ))}
          </div>
        )}
      </div>
      <div className="mt-10">
        <FlyingKit delay={-6} />
      </div>
    </Section>
  );
}
