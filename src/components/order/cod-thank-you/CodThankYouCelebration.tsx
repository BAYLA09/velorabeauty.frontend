"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type Particle = {
  id: number;
  tx: number;
  ty: number;
  rot: number;
  delay: number;
  duration: number;
  color: string;
  w: number;
  h: number;
  round: boolean;
};

const COLORS = ["#5c2a32", "#c9a962", "#dcc48a", "#6f3540", "#a8884a", "#3a1820"] as const;

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.55;
    const dist = 70 + Math.random() * 130;
    return {
      id: i,
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist - 55,
      rot: Math.random() * 720 - 360,
      delay: Math.random() * 0.12,
      duration: 0.85 + Math.random() * 0.75,
      color: COLORS[i % COLORS.length] ?? COLORS[0],
      w: 5 + Math.random() * 4,
      h: 5 + Math.random() * 7,
      round: Math.random() > 0.45,
    };
  });
}

/** One-shot pinata burst when thank-you page loads (Velora palette). */
export function CodThankYouCelebration() {
  const particles = useMemo(() => buildParticles(36), []);
  const [visible, setVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const hide = window.setTimeout(() => setVisible(false), 3400);
    return () => window.clearTimeout(hide);
  }, []);

  if (!visible || reduceMotion) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-30 h-52 overflow-visible"
      aria-hidden
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute left-1/2 top-[4.75rem] -translate-x-1/2 opacity-0 will-change-transform"
          style={
            {
              width: p.w,
              height: p.h,
              backgroundColor: p.color,
              borderRadius: p.round ? "9999px" : "2px",
              animation: `codPinataBurst ${p.duration}s ease-out ${p.delay}s forwards`,
              boxShadow: "0 1px 2px rgba(58,24,32,0.12)",
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
              "--rot": `${p.rot}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
