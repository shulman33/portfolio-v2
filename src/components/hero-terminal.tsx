"use client";

import { useState, useEffect, useRef } from "react";
import { useBootComplete } from "./boot-sequence-context";

// Pre-formatted display lines for the terminal
const displayLines = [
  '{',
  '  "name": "Sam Shulman",',
  '  "role": "Software Engineer + AI Builder",',
  '  "location": "New York, NY",',
  '  "degree": "B.S. CS, Distributed Systems",',
  '  "stack": [',
  '    "Next.js", "Python", "LangChain",',
  '    "TypeScript", "PostgreSQL", "Redis",',
  '    "Java", "Claude", "GPT", "Gemini"',
  '  ],',
  '  "focus": "AI-native applications",',
  '  "building": "the future",',
  '  "ai_twin": true',
  '}',
];

function colorize(line: string) {
  // Color keys (purple), string values (blue), braces/brackets (text-muted), true (blue)
  const parts: { text: string; color: string }[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    // Match key
    const keyMatch = remaining.match(/^(\s*"[^"]+")(\s*:\s*)/);
    if (keyMatch) {
      parts.push({ text: keyMatch[1], color: "var(--purple)" });
      parts.push({ text: keyMatch[2], color: "var(--text-muted)" });
      remaining = remaining.slice(keyMatch[0].length);
      continue;
    }

    // Match string value
    const strMatch = remaining.match(/^("[^"]*")/);
    if (strMatch) {
      parts.push({ text: strMatch[1], color: "var(--blue)" });
      remaining = remaining.slice(strMatch[0].length);
      continue;
    }

    // Match true/false
    const boolMatch = remaining.match(/^(true|false)/);
    if (boolMatch) {
      parts.push({ text: boolMatch[1], color: "var(--blue)" });
      remaining = remaining.slice(boolMatch[0].length);
      continue;
    }

    // Everything else (braces, brackets, commas, whitespace)
    const otherMatch = remaining.match(/^([^"tf]+|[tf](?!rue|alse))/);
    if (otherMatch) {
      parts.push({ text: otherMatch[0], color: "var(--text-muted)" });
      remaining = remaining.slice(otherMatch[0].length);
      continue;
    }

    // Fallback: single char
    parts.push({ text: remaining[0], color: "var(--text-muted)" });
    remaining = remaining.slice(1);
  }

  return parts;
}

export default function HeroTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [done, setDone] = useState(false);
  const bootComplete = useBootComplete();
  const intervalCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!bootComplete) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setVisibleLines(displayLines.length);
      setDone(true);
      return;
    }

    // Small delay after boot completes for visual pacing
    const startDelay = setTimeout(() => {
      let line = 0;
      const interval = setInterval(() => {
        line++;
        setVisibleLines(line);
        if (line >= displayLines.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, 120);

      intervalCleanupRef.current = () => clearInterval(interval);
    }, 200);

    return () => {
      clearTimeout(startDelay);
      intervalCleanupRef.current?.();
    };
  }, [bootComplete]);

  return (
    <div className="border border-border overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-2 bg-surface-2 px-4 py-2.5 border-b border-border">
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
          career_profile.json
        </span>
      </div>

      {/* Terminal body */}
      <div className="bg-void p-5 font-mono text-[0.75rem] leading-[1.9] min-h-[320px]">
        {displayLines.map((line, i) => (
          <div
            key={i}
            className="transition-opacity duration-150"
            style={{ opacity: i < visibleLines ? 1 : 0 }}
          >
            {colorize(line).map((part, j) => (
              <span key={j} style={{ color: part.color }}>
                {part.text}
              </span>
            ))}
          </div>
        ))}

        {/* Prompt with blinking cursor */}
        {done && (
          <div className="mt-3 flex items-center">
            <span className="text-green">$&nbsp;</span>
            <span className="cursor-blink" />
          </div>
        )}
      </div>
    </div>
  );
}
