"use client";
import { useEffect, useState, ReactNode } from "react";

// ── Config ────────────────────────────────────────────────────────────────────
const COLS = 10;
const ROWS = 12;
const COLOR     = "#4CAF50"; // ScrapSeva green (upper triangle)
const COLOR_ALT = "#388E3C"; // slightly darker (lower triangle — adds depth)

// ── Triangle tile ─────────────────────────────────────────────────────────────
// Each grid cell contains two CSS-border triangles:
//   upper-left  → COLOR
//   lower-right → COLOR_ALT
//
// "animate" prop drives the CSS transition target.
// Triangles always START at opacity:0 / resting transform, then
// animate to their target when `animate` flips true.
// This guarantees the browser always has a FROM state to transition from.

function Triangle({
  col,
  row,
  totalCols,
  totalRows,
  phase,       // "in" | "out"
  animate,     // false = resting (opacity 0), true = play to target
}: {
  col: number; row: number;
  totalCols: number; totalRows: number;
  phase: "in" | "out";
  animate: boolean;
}) {
  // Diagonal wave distance (0 = bottom-left, 1 = top-right)
  const dist =
    ((totalCols - 1 - col) / (totalCols - 1)) * 0.4 +
    ((totalRows - 1 - row) / (totalRows - 1)) * 0.6;

  // Cover wave: bottom-left first (low dist = short delay)
  // Shatter wave: also bottom-left first (low dist = short delay)
  const delay =
    phase === "in"
      ? dist * 0.42
      : (1 - dist) * 0.52;

  const dur = phase === "in" ? 0.32 : 0.38;

  // Where each triangle flies TO during shatter
  const midX = totalCols / 2;
  const upperScatterX = (col - midX) * 10;
  const upperScatterY = -(row + 1) * 7;
  const upperRot      = (col % 2 === 0 ? 1 : -1) * 28;

  const lowerScatterX = (col - midX) * 12;
  const lowerScatterY = (totalRows - row) * 6;
  const lowerRot      = (col % 2 === 0 ? -1 : 1) * 22;

  // ── Upper triangle (top-left half of cell) ────────────────────────────────
  const upperVisible =
    phase === "in"
      ? animate           // cover: fade in
      : !animate;         // shatter: fade out (starts visible, animate=false means "play exit")

  const upperTransform =
    phase === "out" && animate
      ? `translate(${upperScatterX}px, ${upperScatterY}px) rotate(${upperRot}deg)`
      : "translate(0,0) rotate(0deg)";

  // ── Lower triangle (bottom-right half of cell) ───────────────────────────
  const lowerVisible =
    phase === "in"
      ? animate
      : !animate;

  const lowerTransform =
    phase === "out" && animate
      ? `translate(${lowerScatterX}px, ${lowerScatterY}px) rotate(${lowerRot}deg)`
      : "translate(0,0) rotate(0deg)";

  const cellStyle: React.CSSProperties = {
    position: "absolute",
    left:   `${(col / totalCols) * 100}%`,
    top:    `${(row / totalRows) * 100}%`,
    width:  `${100 / totalCols}%`,
    height: `${100 / totalRows}%`,
    overflow: "hidden",
  };

  const upperStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: `${100 / ROWS}vh ${100 / COLS}vw 0 0`,
    borderColor: `${COLOR} transparent transparent transparent`,
    opacity: upperVisible ? 1 : 0,
    transform: upperTransform,
    transition: `opacity ${dur}s ease ${delay}s, transform ${dur}s ease ${delay}s`,
    willChange: "opacity, transform",
  };

  const lowerStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: `0 0 ${100 / ROWS}vh ${100 / COLS}vw`,
    borderColor: `transparent transparent ${COLOR_ALT} transparent`,
    opacity: lowerVisible ? 1 : 0,
    transform: lowerTransform,
    transition: `opacity ${dur + 0.04}s ease ${delay + 0.03}s, transform ${dur + 0.04}s ease ${delay + 0.03}s`,
    willChange: "opacity, transform",
  };

  return (
    <div style={cellStyle}>
      <div style={upperStyle} />
      <div style={lowerStyle} />
    </div>
  );
}

// ── Overlay ───────────────────────────────────────────────────────────────────
function TriangleOverlay({
  phase,
  animate,
}: {
  phase: "in" | "out" | "idle";
  animate: boolean;
}) {
  if (phase === "idle") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        pointerEvents: "all",
      }}
    >
      {Array.from({ length: ROWS }).map((_, row) =>
        Array.from({ length: COLS }).map((_, col) => (
          <Triangle
            key={`${row}-${col}`}
            col={col}
            row={row}
            totalCols={COLS}
            totalRows={ROWS}
            phase={ phase}
            animate={animate}
          />
        ))
      )}
    </div>
  );
}

// ── Template ──────────────────────────────────────────────────────────────────
//
// Sequence:
//   [mount]  phase="in",  animate=false  → all triangles invisible (opacity 0)
//   [rAF×2]  animate=true               → cover wave plays (bottom-left → top-right)
//   [700ms]  show new page content underneath
//   [900ms]  phase="out", animate=false → triangles "reset" to visible instantly (no transition)
//   [rAF×2]  animate=true               → shatter wave plays (bottom-left flies away first)
//   [1850ms] phase="idle"               → overlay unmounts, done
//
export default function Template({ children }: { children: ReactNode }) {
  const [phase,        setPhase]        = useState<"in" | "out" | "idle">("in");
  const [animate,      setAnimate]      = useState(false);
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    // ── COVER phase ──────────────────────────────────────────────────────────
    setPhase("in");
    setAnimate(false);     // triangles start invisible
    setShowChildren(false);

    // Double rAF: first rAF lets React commit the DOM with opacity:0,
    // second rAF lets the browser paint it, THEN we flip animate → transition fires
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimate(true);  // → cover wave plays
      });
    });

    // ── Swap content ─────────────────────────────────────────────────────────
    const t1 = setTimeout(() => {
      setShowChildren(true);
    }, 700);

    // ── SHATTER phase ────────────────────────────────────────────────────────
    const t2 = setTimeout(() => {
      // Switch to "out" with animate=false first so triangles are
      // instantly visible (no transition), then trigger shatter on next paint
      setPhase("out");
      setAnimate(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true); // → shatter wave plays
        });
      });
    }, 900);

    // ── Cleanup ──────────────────────────────────────────────────────────────
    const t3 = setTimeout(() => {
      setPhase("idle");
    }, 1880);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <>
      <TriangleOverlay phase={phase} animate={animate} />

      <div
        style={{
          opacity: showChildren ? 1 : 0,
          transition: "opacity 0.35s ease 0.1s",
        }}
      >
        {children}
      </div>
    </>
  );
}