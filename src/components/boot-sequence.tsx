"use client";

import { useState, useEffect } from "react";
import { BootSequenceContext } from "./boot-sequence-context";

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
  // Always start with overlay showing to avoid hydration mismatch.
  // The useEffect below checks skip conditions on the client.
  const [phase, setPhase] = useState<"overlay" | "fading" | "done">("overlay");
  const [visibleLines, setVisibleLines] = useState(0);
  const [skipChecked, setSkipChecked] = useState(false);

  // Check skip conditions on mount (client only)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hasBooted = sessionStorage.getItem("void_terminal_booted");

    if (prefersReducedMotion || hasBooted) {
      setPhase("done");
    }
    setSkipChecked(true);
  }, []);

  // Run boot line animation
  useEffect(() => {
    if (!skipChecked || phase !== "overlay") return;

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
          setPhase("fading");
          setTimeout(() => setPhase("done"), 300);
        }, 400);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [skipChecked, phase]);

  const bootComplete = phase === "done";

  return (
    <BootSequenceContext.Provider value={bootComplete}>
      <div
        style={{
          opacity: bootComplete ? 1 : 0,
          transition: bootComplete ? "opacity 0.3s ease" : "none",
        }}
      >
        {children}
      </div>

      {!bootComplete && (
        <div
          className="fixed inset-0 bg-void flex items-center justify-center transition-opacity duration-300"
          style={{
            zIndex: 10000,
            opacity: phase === "fading" ? 0 : 1,
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
    </BootSequenceContext.Provider>
  );
}
