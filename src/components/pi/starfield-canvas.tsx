"use client";

import * as React from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  twinkle: number;
}

/**
 * Lightweight animated starfield rendered to a canvas. Respects
 * prefers-reduced-motion and devicePixelRatio. Purely decorative.
 */
export function StarfieldCanvas({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.floor((w * h) / 12000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.8 + 0.2,
        size: Math.random() * 1.6 + 0.4,
        twinkle: Math.random() * Math.PI * 2,
      }));
    }

    function draw(t: number) {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const flick = reduce
          ? 0.6
          : 0.5 + Math.sin(t * 0.0015 + s.twinkle) * 0.35 + 0.15;
        const alpha = flick * s.z;
        // gold/purple mix
        const gold = s.z > 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = gold
          ? `rgba(245, 197, 96, ${alpha})`
          : `rgba(167, 139, 250, ${alpha * 0.85})`;
        ctx.fill();
        // slow drift upward
        if (!reduce) {
          s.y -= s.z * 0.12;
          if (s.y < -2) {
            s.y = h + 2;
            s.x = Math.random() * w;
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
