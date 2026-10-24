"use client";

import { Kit } from "@/components/kit/kit";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
      <Kit pose="inspector" className="w-40" />
      <h1 className="text-3xl">Something broke.</h1>
      <p className="text-sm text-muted">Kit is inspecting it. Try again, or come back in a minute.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
