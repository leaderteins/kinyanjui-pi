"use client";

import * as React from "react";
import { ShareButton } from "./share-button";

interface SectionHeaderProps {
  n: string; // e.g. "01"
  badge?: {
    icon: React.ElementType;
    label: string;
    color: "gold" | "purple" | "teal" | "rose";
  };
  title: React.ReactNode;
  description?: React.ReactNode;
  sectionId: string;
  align?: "left" | "center";
  className?: string;
  actions?: React.ReactNode;
}

const BADGE_COLORS = {
  gold: "border-pi-gold/30 bg-pi-gold/10 text-pi-gold",
  purple: "border-pi-purple/30 bg-pi-purple/10 text-pi-purple",
  teal: "border-pi-teal/30 bg-pi-teal/10 text-pi-teal",
  rose: "border-pi-rose/30 bg-pi-rose/10 text-pi-rose",
} as const;

export function SectionHeader({
  n,
  badge,
  title,
  description,
  sectionId,
  align = "left",
  className,
  actions,
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <div
      className={`flex items-start justify-between gap-4 ${className ?? ""}`}
    >
      <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
        <span className="mb-2 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground/70">
          {centered && <span className="h-px w-8 bg-gradient-to-l from-pi-gold/60 to-transparent" />}
          <span className="text-gradient-gold">{n}</span>
          <span className="h-px w-8 bg-gradient-to-r from-pi-gold/60 to-transparent" />
          Section
        </span>
        {badge && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${BADGE_COLORS[badge.color]}`}
          >
            <badge.icon className="h-3.5 w-3.5" />
            {badge.label}
          </span>
        )}
        <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      <ShareButton sectionId={sectionId} className="mt-1 shrink-0" />
    </div>
  );
}
