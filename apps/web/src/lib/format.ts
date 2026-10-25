export const shortAddress = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

export const formatDate = (unixSeconds: number) =>
  new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const isNew = (listedAt: number, days = 7) => Date.now() / 1000 - listedAt < days * 86400;

/** "just now", "5m ago", "3h ago", "2d ago", then a date. */
export const timeAgo = (unixSeconds: number, now = Date.now() / 1000) => {
  const s = Math.max(0, now - unixSeconds);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 30 * 86400) return `${Math.floor(s / 86400)}d ago`;
  return formatDate(unixSeconds);
};
