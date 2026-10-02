// Shared types & constants for the Pi Network domain portfolio site

export type DomainCategory =
  | "personal"
  | "business"
  | "community"
  | "marketplace"
  | "defi"
  | "nft"
  | "utility";

export type DomainStatus = "held" | "developed" | "for-sale" | "auction";

export type DomainAccent = "gold" | "purple" | "teal" | "rose";

export interface PiDomain {
  id: string;
  name: string;
  label: string;
  tagline: string;
  description: string;
  category: string;
  status: string;
  pricePi: number | null;
  featured: boolean;
  emoji: string;
  accent: string;
  views: number;
  createdAt: string;
}

export const CATEGORY_LABELS: Record<string, string> = {
  personal: "Personal",
  business: "Business",
  community: "Community",
  marketplace: "Marketplace",
  defi: "DeFi",
  nft: "NFT",
  utility: "Utility",
};

export const STATUS_LABELS: Record<string, string> = {
  held: "Held",
  developed: "In Development",
  "for-sale": "For Sale",
  auction: "On Auction",
};

export const ACCENT_STYLES: Record<
  string,
  { text: string; bg: string; border: string; ring: string; from: string; to: string }
> = {
  gold: {
    text: "text-pi-gold",
    bg: "bg-pi-gold/10",
    border: "border-pi-gold/30",
    ring: "ring-pi-gold/30",
    from: "from-pi-gold/20",
    to: "to-amber-500/5",
  },
  purple: {
    text: "text-pi-purple",
    bg: "bg-pi-purple/10",
    border: "border-pi-purple/30",
    ring: "ring-pi-purple/30",
    from: "from-pi-purple/20",
    to: "to-purple-500/5",
  },
  teal: {
    text: "text-pi-teal",
    bg: "bg-pi-teal/10",
    border: "border-pi-teal/30",
    ring: "ring-pi-teal/30",
    from: "from-pi-teal/20",
    to: "to-teal-500/5",
  },
  rose: {
    text: "text-pi-rose",
    bg: "bg-pi-rose/10",
    border: "border-pi-rose/30",
    ring: "ring-pi-rose/30",
    from: "from-pi-rose/20",
    to: "to-rose-500/5",
  },
};

export const NAV_LINKS = [
  { href: "#portfolio", label: "Domains" },
  { href: "#about", label: "About Pi" },
  { href: "#services", label: "Use Cases" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];
