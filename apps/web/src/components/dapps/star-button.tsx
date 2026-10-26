"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useAccount, useConnect, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import { TxPending } from "@/components/web3/tx-pending";
import { Kit } from "@/components/kit/kit";
import { useIsStarred } from "@/hooks/use-projects";
import { useRegistryWrite } from "@/hooks/use-registry-write";
import { useIsClient } from "@/hooks/use-is-client";
import { CHAIN } from "@/lib/config";
import { gsap } from "@/lib/gsap";
import type { Dapp } from "@/lib/types";

const METAMASK_URL = "https://metamask.io/download/";

/**
 * Pins its children under the anchor's bottom-right corner, portalled to <body>. Cards clip
 * (overflow-hidden) or stack over each other, so an in-flow popover got hidden by the next card.
 */
function Anchored({ anchor, children }: { anchor: RefObject<HTMLElement | null>; children: ReactNode }) {
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);

  useEffect(() => {
    let raf = 0;
    const place = () => {
      const el = anchor.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPos({ top: r.bottom + 8, right: Math.max(8, window.innerWidth - r.right) });
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(place);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
    };
  }, [anchor]);

  if (!pos) return null;
  return createPortal(
    <div className="fixed z-40" style={{ top: pos.top, right: pos.right }}>
      {children}
    </div>,
    document.body,
  );
}

export function StarButton({ dapp, size = "sm" }: { dapp: Dapp; size?: "sm" | "md" }) {
  const mounted = useIsClient();
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { switchChainAsync } = useSwitchChain();
  const { data: starred } = useIsStarred(dapp.id, address);
  const { state, run, reset } = useRegistryWrite();
  const [party, setParty] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const lastAction = useRef<"star" | "unstar">("star");
  const burst = useRef<HTMLSpanElement>(null);
  const anchor = useRef<HTMLButtonElement>(null);

  // Party Kit moment after a successful star.
  useEffect(() => {
    if (state.status === "success" && lastAction.current === "star") {
      // Little burst of stars out of the button (skipped under reduced motion).
      if (burst.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(
          burst.current.children,
          { x: 0, y: 0, scale: 0.4, opacity: 1, rotation: 0 },
          {
            x: (i: number) => Math.cos((i / 10) * Math.PI * 2) * gsap.utils.random(38, 70),
            y: (i: number) => Math.sin((i / 10) * Math.PI * 2) * gsap.utils.random(30, 60),
            scale: () => gsap.utils.random(0.8, 1.4),
            rotation: () => gsap.utils.random(-180, 180),
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
          },
        );
      }
      setParty(true);
      const t = setTimeout(() => {
        setParty(false);
        reset();
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [state.status, reset]);

  if (mounted && address && address.toLowerCase() === dapp.lister.toLowerCase()) {
    return <span className="text-muted px-2 text-sm">Your project</span>;
  }

  const pending = state.status === "pending";
  const action = starred ? "unstar" : "star";
  const hasProvider = mounted && "ethereum" in window;

  async function handleAction() {
    setAuthError(null);
    const needsConnect = !isConnected;
    if (needsConnect || chainId !== CHAIN.id) {
      const connector = connectors[0];
      if (!hasProvider || !connector) {
        setAuthError("MetaMask not found.");
        return;
      }
      setAuthBusy(true);
      try {
        if (needsConnect) {
          const result = await connectAsync({ connector });
          if (result.accounts.some((a) => a.toLowerCase() === dapp.lister.toLowerCase())) {
            setAuthError("You can't star your own project.");
            setAuthBusy(false);
            return;
          }
          if (result.chainId !== CHAIN.id) await switchChainAsync({ chainId: CHAIN.id });
        } else {
          await switchChainAsync({ chainId: CHAIN.id });
        }
      } catch {
        setAuthError(needsConnect ? "Wallet connection cancelled." : "Switch cancelled.");
        setAuthBusy(false);
        return;
      }
      setAuthBusy(false);
    }
    lastAction.current = action;
    void run(action, [BigInt(dapp.id)]);
  }

  return (
    <div className="relative flex flex-col items-end gap-1">
      <span ref={burst} aria-hidden className="pointer-events-none absolute top-4 right-10 z-30">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="text-brand absolute text-sm opacity-0">
            ★
          </span>
        ))}
      </span>
      <Button
        ref={anchor}
        variant={starred ? "outline" : "primary"}
        size={size}
        disabled={pending || authBusy}
        onClick={() => void handleAction()}
      >
        {pending
          ? "Waiting…"
          : authBusy
            ? isConnected
              ? "Switching…"
              : "Connecting…"
            : starred
              ? "Unstar"
              : "⭐ Star"}
      </Button>
      {pending && (
        <Anchored anchor={anchor}>
          <div className="w-60">
            <TxPending label="Confirm in your wallet, then we check the chain…" />
          </div>
        </Anchored>
      )}
      {party && (
        <Anchored anchor={anchor}>
          <div
            role="status"
            className="border-line text-ink flex w-56 items-center gap-2 rounded-xl border bg-white p-3 text-sm shadow-lg"
          >
            <Kit pose="party" className="w-14 shrink-0" />
            <span>Starred! Kit says thanks.</span>
          </div>
        </Anchored>
      )}
      {state.status === "error" && (
        <span role="alert" className="text-pink max-w-48 text-right text-xs">
          {state.message}
        </span>
      )}
      {authError && (
        <span role="alert" className="text-pink max-w-48 text-right text-xs">
          {authError}{" "}
          {!hasProvider && (
            <a href={METAMASK_URL} target="_blank" rel="noopener noreferrer" className="underline">
              Install
            </a>
          )}
        </span>
      )}
    </div>
  );
}
