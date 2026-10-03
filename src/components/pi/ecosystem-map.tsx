"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Network, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "./section-header";

// The portfolio's ecosystem map — kinyanjui.pi is the hub, with category branches.
interface MapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
  emoji: string;
  accent: string;
  isHub?: boolean;
}

interface MapEdge {
  from: string;
  to: string;
}

const NODES: MapNode[] = [
  // Hub
  {
    id: "kinyanjui",
    label: "kinyanjui.pi",
    x: 300,
    y: 200,
    r: 36,
    emoji: "π",
    accent: "gold",
    isHub: true,
  },
  // Branch: Marketplace
  { id: "soko", label: "soko.pi", x: 120, y: 80, r: 24, emoji: "🛍️", accent: "teal" },
  { id: "kilimo", label: "kilimo.pi", x: 60, y: 200, r: 20, emoji: "🌾", accent: "teal" },
  // Branch: Community
  { id: "pioneerhub", label: "pioneerhub.pi", x: 300, y: 50, r: 24, emoji: "🚀", accent: "purple" },
  // Branch: DeFi
  { id: "piwallet", label: "piwallet.pi", x: 540, y: 80, r: 24, emoji: "👛", accent: "gold" },
  { id: "mali", label: "mali.pi", x: 540, y: 200, r: 20, emoji: "💎", accent: "purple" },
  { id: "piswap", label: "piswap.pi", x: 560, y: 300, r: 22, emoji: "🔄", accent: "gold" },
  // Branch: NFT
  { id: "piart", label: "piart.pi", x: 300, y: 350, r: 24, emoji: "🎨", accent: "rose" },
];

const EDGES: MapEdge[] = [
  // Hub to branch heads
  { from: "kinyanjui", to: "soko" },
  { from: "kinyanjui", to: "pioneerhub" },
  { from: "kinyanjui", to: "piwallet" },
  { from: "kinyanjui", to: "piart" },
  // Sub-connections
  { from: "soko", to: "kilimo" },
  { from: "piwallet", to: "mali" },
  { from: "piwallet", to: "piswap" },
];

const ACCENT_HEX: Record<string, string> = {
  gold: "var(--pi-gold)",
  purple: "var(--pi-purple)",
  teal: "var(--pi-teal)",
  rose: "var(--pi-rose)",
};

const CATEGORY_BRANCHES = [
  { label: "Marketplace", color: "var(--pi-teal)", domains: ["soko.pi", "kilimo.pi"] },
  { label: "Community", color: "var(--pi-purple)", domains: ["pioneerhub.pi"] },
  { label: "DeFi", color: "var(--pi-gold)", domains: ["piwallet.pi", "mali.pi", "piswap.pi"] },
  { label: "NFT", color: "var(--pi-rose)", domains: ["piart.pi"] },
];

export function EcosystemMap() {
  const [hovered, setHovered] = React.useState<string | null>(null);

  const nodeMap = React.useMemo(
    () => Object.fromEntries(NODES.map((n) => [n.id, n])),
    []
  );

  return (
    <section
      id="ecosystem"
      className="relative scroll-mt-20 overflow-hidden border-y border-border/60 bg-card/30 py-20 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 pi-grid-bg opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          n="08"
          sectionId="ecosystem"
          align="center"
          badge={{ icon: Network, label: "Ecosystem map", color: "teal" }}
          title={
            <>
              The <span className="text-gradient-gold">.pi ecosystem</span> at a glance
            </>
          }
          description={
            <>
              Every domain in the portfolio connects back to the kinyanjui.pi
              hub. Hover any node to explore its relationships.
            </>
          }
        />

        <div className="mt-10 grid items-center gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          {/* SVG map */}
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/40 p-4 backdrop-blur-sm">
            <svg
              viewBox="0 0 600 400"
              className="h-full w-full"
              style={{ minHeight: "320px" }}
            >
              <defs>
                <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--pi-gold)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--pi-gold)" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Edges */}
              {EDGES.map((edge, i) => {
                const from = nodeMap[edge.from];
                const to = nodeMap[edge.to];
                if (!from || !to) return null;
                const isActive =
                  hovered === edge.from || hovered === edge.to;
                return (
                  <motion.line
                    key={i}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={
                      isActive
                        ? "var(--pi-gold)"
                        : "var(--border)"
                    }
                    strokeWidth={isActive ? 2.5 : 1.5}
                    strokeDasharray={isActive ? "0" : "4 4"}
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                );
              })}

              {/* Hub glow */}
              <circle cx={300} cy={200} r={60} fill="url(#hub-glow)" />

              {/* Nodes */}
              {NODES.map((node, i) => {
                const isHovered = hovered === node.id;
                const isConnected = EDGES.some(
                  (e) => hovered && (e.from === hovered || e.to === hovered) &&
                    (e.from === node.id || e.to === node.id)
                );
                const dimmed = hovered && !isHovered && !isConnected;
                return (
                  <motion.g
                    key={node.id}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    style={{ opacity: dimmed ? 0.3 : 1 }}
                    onMouseEnter={() => setHovered(node.id)}
                    onMouseLeave={() => setHovered(null)}
                    className="cursor-pointer"
                  >
                    {/* node circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r}
                      fill={ACCENT_HEX[node.accent]}
                      fillOpacity={node.isHub ? 0.2 : 0.15}
                      stroke={ACCENT_HEX[node.accent]}
                      strokeWidth={node.isHub ? 2.5 : 1.5}
                      className="transition-all"
                      style={{
                        filter: isHovered
                          ? `drop-shadow(0 0 8px ${ACCENT_HEX[node.accent]})`
                          : "none",
                      }}
                    />
                    {/* pulse ring on hover */}
                    {isHovered && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.r}
                        fill="none"
                        stroke={ACCENT_HEX[node.accent]}
                        strokeWidth="1"
                        opacity="0.5"
                      >
                        <animate
                          attributeName="r"
                          from={node.r}
                          to={node.r + 12}
                          dur="1.2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.5"
                          to="0"
                          dur="1.2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    {/* emoji */}
                    <text
                      x={node.x}
                      y={node.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={node.isHub ? 22 : 16}
                    >
                      {node.emoji}
                    </text>
                    {/* label */}
                    <text
                      x={node.x}
                      y={node.y + node.r + 14}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={node.isHub ? 700 : 500}
                      fill="var(--foreground)"
                      className="font-mono"
                    >
                      {node.label}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>

          {/* Legend / category branches */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur-sm">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Zap className="h-4 w-4 text-pi-gold" />
                Category branches
              </h3>
              <div className="mt-3 space-y-2.5">
                {CATEGORY_BRANCHES.map((branch) => (
                  <div
                    key={branch.label}
                    className="flex items-center gap-2 rounded-lg border border-border/40 bg-card/40 px-2.5 py-2"
                    onMouseEnter={() => setHovered(null)}
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: branch.color }}
                    />
                    <span className="flex-1 text-xs font-medium">{branch.label}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {branch.domains.join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur-sm">
              <h3 className="text-sm font-semibold">Hub: kinyanjui.pi</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                The flagship identity domain anchors the portfolio. Every other
                .pi name connects back to it — marketplace, community, DeFi and
                NFT branches radiate outward.
              </p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="font-mono">{NODES.length}</span> nodes
                <span className="h-1 w-1 rounded-full bg-border" />
                <span className="font-mono">{EDGES.length}</span> connections
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
