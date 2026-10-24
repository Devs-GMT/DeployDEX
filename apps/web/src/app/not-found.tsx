import { KitInBox } from "@/components/kit/kit-in-box";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
      <KitInBox className="w-52" />
      <h1 className="text-3xl">This dApp ran off.</h1>
      <p className="text-muted text-sm">That page doesn&apos;t exist. Kit is still looking.</p>
      <ButtonLink href="/">Back home</ButtonLink>
    </div>
  );
}
