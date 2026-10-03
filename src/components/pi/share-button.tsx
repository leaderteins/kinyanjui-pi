"use client";

import * as React from "react";
import { Share2, Check, Link2, Twitter, Send } from "lucide-react";
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

  function getText() {
    return `kinyanjui.pi — explore the .pi domain portfolio #${sectionId}`;
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

  function shareTwitter() {
    const url = encodeURIComponent(getUrl());
    const text = encodeURIComponent(getText());
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,noreferrer,width=600,height=500"
    );
  }

  function shareTelegram() {
    const url = encodeURIComponent(getUrl());
    const text = encodeURIComponent(getText());
    window.open(
      `https://t.me/share/url?url=${url}&text=${text}`,
      "_blank",
      "noopener,noreferrer,width=600,height=500"
    );
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
      <PopoverContent align="end" sideOffset={6} className="w-56 p-2">
        <p className="px-2 pb-1 pt-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Share to
        </p>
        <button
          onClick={shareTwitter}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent"
        >
          <Twitter className="h-3.5 w-3.5 text-pi-purple" />
          X / Twitter
        </button>
        <button
          onClick={shareTelegram}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent"
        >
          <Send className="h-3.5 w-3.5 text-pi-teal" />
          Telegram
        </button>
        <button
          onClick={shareNative}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent"
        >
          <Share2 className="h-3.5 w-3.5 text-pi-purple" />
          More… (Web Share)
        </button>
        <div className="my-1 h-px bg-border/60" />
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
