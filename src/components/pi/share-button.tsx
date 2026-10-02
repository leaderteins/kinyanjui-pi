"use client";

import * as React from "react";
import { Share2, Check, Link2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface ShareButtonProps {
  sectionId: string;
  label?: string;
  className?: string;
}

export function ShareButton({
  sectionId,
  label = "Share",
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false);

  function getUrl() {
    if (typeof window === "undefined") return `#${sectionId}`;
    return `${window.location.origin}${window.location.pathname}#${sectionId}`;
  }

  async function copyLink() {
    const url = getUrl();
    try {
      await navigator.clipboard?.writeText(url);
      setCopied(true);
      toast.success("Section link copied", {
        description: url,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  }

  async function shareNative() {
    const url = getUrl();
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({
          title: `kinyanjui.pi — #${sectionId}`,
          url,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      copyLink();
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label={`Share ${sectionId} section`}
          className={`inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-pi-gold/40 hover:text-pi-gold ${className ?? ""}`}
        >
          <Share2 className="h-3 w-3" />
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={6} className="w-52 p-2">
        <button
          onClick={shareNative}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent"
        >
          <Share2 className="h-3.5 w-3.5 text-pi-purple" />
          Share…
        </button>
        <button
          onClick={copyLink}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-pi-teal" />
          ) : (
            <Link2 className="h-3.5 w-3.5 text-pi-gold" />
          )}
          {copied ? "Copied!" : "Copy deep link"}
        </button>
      </PopoverContent>
    </Popover>
  );
}
