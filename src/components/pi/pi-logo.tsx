"use client";

import { motion } from "framer-motion";

interface PiLogoProps {
  size?: number;
  className?: string;
  withOrbit?: boolean;
}

/**
 * The kinyanjui.pi mark — a gold π glyph inside a faceted hexagon,
 * with optional orbiting satellite dots.
 */
export function PiLogo({ size = 40, className, withOrbit = false }: PiLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className ?? ""}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        fill="none"
        className="relative z-10"
      >
        <defs>
          <linearGradient id="pi-grad" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="var(--pi-gold)" />
            <stop offset="100%" stopColor="var(--pi-purple)" />
          </linearGradient>
          <linearGradient id="pi-grad-2" x1="0" y1="0" x2="0" y2="48">
            <stop offset="0%" stopColor="var(--pi-gold)" />
            <stop offset="100%" stopColor="var(--pi-purple)" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {/* Hexagon facets */}
        <motion.path
          d="M24 2 L43 13 V35 L24 46 L5 35 V13 Z"
          fill="url(#pi-grad)"
          opacity="0.16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.16 }}
          transition={{ duration: 0.8 }}
        />
        <path
          d="M24 2 L43 13 V35 L24 46 L5 35 V13 Z"
          stroke="url(#pi-grad)"
          strokeWidth="1.5"
          opacity="0.7"
        />
        {/* Inner ring */}
        <circle cx="24" cy="24" r="16" stroke="url(#pi-grad-2)" strokeWidth="1" opacity="0.5" />
        {/* π glyph */}
        <text
          x="24"
          y="31"
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fill="url(#pi-grad)"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          π
        </text>
      </svg>
      {withOrbit && (
        <div className="absolute inset-0 z-0">
          <span className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 animate-pi-orbit">
            <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-pi-gold shadow-[0_0_8px_var(--pi-gold)]" />
          </span>
          <span
            className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 animate-pi-orbit"
            style={{ animationDuration: "26s", animationDirection: "reverse" }}
          >
            <span className="absolute left-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-pi-purple shadow-[0_0_8px_var(--pi-purple)]" />
          </span>
        </div>
      )}
    </div>
  );
}
