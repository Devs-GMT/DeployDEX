"use client";

import { useProjects } from "@/hooks/use-projects";
import { DappCard } from "@/components/dapps/dapp-card";
import { EmptyState } from "@/components/dapps/empty-state";
import { REGISTRY_DEPLOYED } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { Em, Section, SectionHead } from "@/components/ui/frame";
import { FlyingKit } from "@/components/ui/decor";

export function Fresh() {
  const { data, isLoading } = useProjects();
  const items = [...(data ?? [])].sort((a, b) => b.listedAt - a.listedAt).slice(0, 8);

  return (
    <Section>
      <SectionHead
        title={<>Fresh <Em>deploys</Em></>}
        sub="The newest listings, straight off the chain."
        action={<ButtonLink href="/dapps?s=new" variant="secondary">See all →</ButtonLink>}
      />
      <div className="mt-12">
        {isLoading && REGISTRY_DEPLOYED ? (
          <p className="py-10 text-center text-sm text-muted" role="status">Loading…</p>
        ) : items.length === 0 ? (
          <div className="dot-grid rounded-3xl border border-dashed border-line bg-card/60">
            <EmptyState />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((d) => <DappCard key={d.id} dapp={d} />)}
          </div>
        )}
      </div>
      <div className="mt-10"><FlyingKit delay={-6} /></div>
    </Section>
  );
}
