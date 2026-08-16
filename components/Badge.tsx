"use client";

import { Hammer } from "lucide-react";

const MESSAGE = "Site under construction — we're building something worth waiting for";
const REPEAT_COUNT = 6;

export default function ConstructionStrip() {
  return (
    <div
      className="relative overflow-hidden w-full py-2.5"
      style={{ background: "var(--color-accent)" }}
    >
      <div className="flex whitespace-nowrap animate-marquee">
        {Array.from({ length: REPEAT_COUNT }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 mx-6">
            <Hammer size={16} strokeWidth={2} style={{ color: "var(--color-ink)" }} />
            <span
              className="text-sm font-semibold tracking-wide"
              style={{ color: "var(--color-ink)" }}
            >
              {MESSAGE}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-marquee {
          width: max-content;
          animation: marquee 22s linear infinite;
        }
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}