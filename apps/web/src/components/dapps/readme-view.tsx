"use client";

import { useEffect, useId, useRef, useState } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";
import { resolveReadmeUrl } from "@/lib/readme";

/**
 * A listed repo's README, rendered like GitHub does. The markdown is untrusted:
 * - inline HTML (common in READMEs, e.g. a centered header) is parsed and then sanitized with
 *   GitHub's own allowlist (rehype-sanitize's default schema): no scripts, event handlers,
 *   styles, iframes or forms survive;
 * - every link and image must end up as https; relative paths are resolved against the repo
 *   on GitHub, anything else (javascript:, data:, http:) is dropped;
 * - links open in a new tab with rel="noopener noreferrer", images send no referrer.
 * Starts collapsed to a short preview (PRD: ~20 lines) with a "Show full README" toggle.
 */
export function ReadmeView({
  markdown,
  owner,
  repo,
  url,
  truncated = false,
}: {
  markdown: string;
  owner: string;
  repo: string;
  url: string;
  truncated?: boolean;
}) {
  const body = useRef<HTMLDivElement>(null);
  const id = useId();
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);

  // Only offer the toggle when the collapsed preview actually hides something.
  useEffect(() => {
    const el = body.current;
    if (!el) return;
    const measure = () => setOverflows(el.scrollHeight > el.clientHeight + 8);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [markdown]);

  const resolve = (value: string, kind: "href" | "src") =>
    resolveReadmeUrl(value, kind, owner, repo) ?? "";

  const components: Components = {
    a: ({ href, children }) => {
      const to = href ? resolve(href, "href") : "";
      return to ? (
        <a href={to} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <span>{children}</span>
      );
    },
    img: ({ src, alt, width, height }) => {
      const to = typeof src === "string" ? resolve(src, "src") : "";
      if (!to) return alt ? <span className="text-muted">[{alt}]</span> : null;
      return (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary README hosts
        <img
          src={to}
          alt={alt ?? ""}
          width={width}
          height={height}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      );
    },
  };

  return (
    <div className="mt-5">
      <div className="relative">
        <div ref={body} id={id} className={cn("readme overflow-hidden", !open && "max-h-96")}>
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={components}
            urlTransform={(u) => u}
          >
            {markdown}
          </Markdown>
          {open && truncated && (
            <p className="text-muted mt-6 text-sm">
              This README continues on{" "}
              <a href={url} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
            </p>
          )}
        </div>
        {!open && overflows && (
          <div
            aria-hidden
            className="from-card pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t to-transparent"
          />
        )}
      </div>
      {(overflows || open) && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="border-line hover:bg-panel mt-3 rounded-xl border px-4 py-2 text-sm font-medium transition-colors"
        >
          {open ? "Show less" : "Show full README"}
        </button>
      )}
    </div>
  );
}
