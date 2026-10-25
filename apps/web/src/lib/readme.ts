/** Keeps a URL only if it is plain https with no credentials. */
function httpsOnly(value: string): string | null {
  if (!URL.canParse(value)) return null;
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) return null;
  return url.toString();
}

/**
 * Resolves a link or image URL found in an (untrusted) README to something safe to render.
 * - Absolute URLs pass only if they are https (javascript:, data:, http:, … are dropped).
 * - Relative paths point into the repo on GitHub: links to the file view, images to the raw file.
 * - In-page anchors and protocol-relative URLs are dropped (we don't render heading ids).
 * Returns null when the URL must not be rendered.
 */
export function resolveReadmeUrl(
  value: string,
  kind: "href" | "src",
  owner: string,
  repo: string,
): string | null {
  const v = value.trim();
  if (!v || v.startsWith("#") || v.startsWith("//")) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return httpsOnly(v);
  const base =
    kind === "src"
      ? `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/`
      : `https://github.com/${owner}/${repo}/blob/HEAD/`;
  return httpsOnly(new URL(v.replace(/^\/+/, ""), base).toString());
}
