"use client";

import { useState, useEffect } from "react";
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy";

const navLinks = [
  { id: "chat", label: "./chat" },
  { id: "projects", label: "./projects" },
  { id: "skills", label: "./skills" },
  { id: "contact", label: "./contact" },
];

const sectionIds = navLinks.map((l) => l.id);

export default function Navbar() {
  const activeId = useScrollSpy(sectionIds);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    if (mobileOpen) {
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  }, [mobileOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-border px-5 py-4 md:px-10 lg:px-16 flex items-center justify-between"
        style={{
          backgroundColor: "rgba(8, 8, 16, 0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Logo */}
        <a href="#hero" className="font-mono text-[0.82rem] text-text">
          sam_shulman
          <span className="cursor-blink ml-0.5" />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isContact = link.id === "contact";
            const isActive = activeId === link.id;

            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`font-mono text-[0.72rem] tracking-wider px-4 py-2 transition-colors ${
                  isContact
                    ? "text-green border border-green bg-green-dim hover:shadow-[var(--green-glow)]"
                    : isActive
                      ? "text-green"
                      : "text-text-dim hover:text-text"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden font-mono text-[0.82rem] text-green px-3 py-2 border border-border hover:border-green/40 transition-colors"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          &gt;_
        </button>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-void flex flex-col animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Terminal header bar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <span
                className="w-[10px] h-[10px] rounded-full bg-[#FF5F57]"
                aria-hidden="true"
              />
              <span
                className="w-[10px] h-[10px] rounded-full bg-[#FFBD2E]"
                aria-hidden="true"
              />
              <span
                className="w-[10px] h-[10px] rounded-full bg-[#28C840]"
                aria-hidden="true"
              />
              <span className="ml-3 font-mono text-[0.65rem] text-text-muted">
                navigation
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="font-mono text-[0.82rem] text-text-muted hover:text-text px-3 py-2"
              aria-label="Close navigation menu"
            >
              [x]
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 flex flex-col justify-center px-8 gap-6">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMobileOpen(false)}
                className="font-mono text-[1.25rem] text-text-dim hover:text-green transition-colors py-2"
              >
                <span className="text-green">&gt; </span>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
