export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

/** Shortcuts under the Explore mega-menu. */
export const EXPLORE_SHORTCUTS: NavLink[] = [
  { label: "All dApps", href: "/dapps" },
  { label: "Most starred", href: "/dapps?s=stars" },
  { label: "Fresh deploys", href: "/dapps?s=new" },
];

/** Links under the Builders mega-menu, shared by desktop and mobile. */
export const BUILDERS_LINKS: NavLink[] = [
  { label: "List your dApp", href: "/list", description: "Add a contract in a minute" },
  { label: "My dApps", href: "/my", description: "Edit listings and track stars" },
  { label: "Listing guidelines", href: "/#faq", description: "What gets approved" },
];

export const ABOUT_HREF = "/#about";
