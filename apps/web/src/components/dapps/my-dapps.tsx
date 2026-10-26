"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useProjects, useMyIds } from "@/hooks/use-projects";
import { useIsClient } from "@/hooks/use-is-client";
import { ConnectButton } from "@/components/web3/connect-button";
import { Button } from "@/components/ui/button";
import { DappCard } from "./dapp-card";
import { DappForm } from "./dapp-form";
import { DelistButton } from "./delist-button";
import { EmptyState } from "./empty-state";
import type { Dapp } from "@/lib/types";

export function MyDapps() {
  const mounted = useIsClient();
  const { address } = useAccount();
  const { data: all } = useProjects();
  const listed = useMyIds("listedOf", address);
  const starred = useMyIds("starredOf", address);
  const [editing, setEditing] = useState<Dapp | null>(null);

  if (!mounted) return null;
  if (!address) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p>Connect your wallet to see the projects you listed and starred.</p>
        <ConnectButton variant="outline" />
      </div>
    );
  }

  const pick = (ids?: number[]) => (all ?? []).filter((d) => ids?.includes(d.id));
  const mine = pick(listed.data);
  const stars = pick(starred.data);

  if (editing) {
    return (
      <div>
        <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>← Back</Button>
        <h2 className="my-4 text-2xl">Edit {editing.name}</h2>
        <DappForm
          mode={{ kind: "edit", id: editing.id }}
          initial={{
            name: editing.name,
            tagline: editing.tagline,
            category: editing.category,
            target: editing.target,
            liveUrl: editing.liveUrl,
            repo: editing.repo,
            logoUrl: editing.logoUrl,
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section>
        <h2 className="mb-4 text-2xl">Listed by you</h2>
        {mine.length === 0 ? (
          <EmptyState title="You haven't listed anything yet." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((d) => (
              // The card fills the leftover height (its Tilt is h-full), so the buttons stay below
              // it instead of being pushed out of the cell over the next section.
              <div key={d.id} className="flex flex-col gap-2">
                <div className="flex-1">
                  <DappCard dapp={d} />
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setEditing(d)}>
                  Edit listing
                </Button>
                <DelistButton dapp={d} />
              </div>
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="mb-4 text-2xl">Starred by you</h2>
        {stars.length === 0 ? (
          <EmptyState title="No stars yet — go find something good." action={false} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stars.map((d) => <DappCard key={d.id} dapp={d} />)}
          </div>
        )}
      </section>
    </div>
  );
}
