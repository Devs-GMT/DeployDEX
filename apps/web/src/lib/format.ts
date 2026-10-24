export const shortAddress = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

export const formatDate = (unixSeconds: number) =>
  new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const isNew = (listedAt: number, days = 7) => Date.now() / 1000 - listedAt < days * 86400;
