"use client";

import { useState, useEffect } from "react";

const bootLines = [
  "> initializing void_terminal v2.0...",
  "> loading modules.............. done",
  "> establishing connection...... done",
  "> rendering portfolio.......... done",
  "",
  "[system ready]",
];

export default function BootSequence({
  children,
}: {
  children: React.ReactNode;
}) {
  // Synchronous initializer: check sessionStorage + reduced motion before first render
  const [shouldShow] = useState(() => {
    if (typeof window === "undefined") return false;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return false;

    const hasBooted = sessionStorage.getItem("void_terminal_booted");
    if (hasBooted) return false;

    return true;
  });

  const [visibleLines, setVisibleLines] = useState(0);
  const [fading, setFading] = useState(false);
  const [done, setDone] = useState(!shouldShow);

  useEffect(() => {
    if (!shouldShow) return;

    let lineIndex = 0;
    const interval = setInterval(() => {
      lineIndex++;
      setVisibleLines(lineIndex);

      if (lineIndex >= bootLines.length) {
        clearInterval(interval);

        // Mark as booted
        sessionStorage.setItem("void_terminal_booted", "1");

        // Start fade out after a brief pause
        setTimeout(() => {
          setFading(true);
          setTimeout(() => setDone(true), 300);
        }, 400);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [shouldShow]);

  return (
    <>
      {children}

      {!done && (
        <div
          className="fixed inset-0 bg-void flex items-center justify-center transition-opacity duration-300"
          style={{
            zIndex: 10000,
            opacity: fading ? 0 : 1,
          }}
          aria-hidden="true"
        >
          <div className="font-mono text-[0.82rem] text-green space-y-1.5 px-6">
            {bootLines.map((line, i) => (
              <div
                key={i}
                className="transition-opacity duration-100"
                style={{ opacity: i < visibleLines ? 1 : 0 }}
              >
                {line || "\u00A0"}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
