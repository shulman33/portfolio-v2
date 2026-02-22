"use client";

import { useInView } from "@/lib/hooks/use-in-view";
import { useEffect, useState, useRef } from "react";

interface Stat {
  value: string;
  numericTarget?: number;
  label: string;
}

const stats: Stat[] = [
  { value: "3+", numericTarget: 3, label: "Years Coding" },
  { value: "10+", numericTarget: 10, label: "Ideas Prototyped" },
  { value: "\u2713", label: "Full-Stack + AI" },
  { value: "\u221E", label: "Always Building" },
];

function CountUpValue({ target, suffix, animate }: { target: number; suffix: string; animate: boolean }) {
  const [display, setDisplay] = useState(0);
  const animated = useRef(false);

  useEffect(() => {
    if (!animate || animated.current) return;
    animated.current = true;

    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [animate, target]);

  return <>{animate ? display : 0}{suffix}</>;
}

export default function StatsBar() {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <div
      ref={ref}
      className="bg-surface border-y border-border grid grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`flex flex-col items-center justify-center py-8 lg:py-10 ${
            i < stats.length - 1 ? "lg:border-r lg:border-border" : ""
          } ${i < 2 ? "border-b lg:border-b-0 border-border" : ""}`}
        >
          <span className="font-heading font-extrabold text-[2.5rem] text-green leading-none mb-2">
            {stat.numericTarget !== undefined ? (
              <CountUpValue
                target={stat.numericTarget}
                suffix="+"
                animate={isInView}
              />
            ) : (
              <span
                className="transition-opacity duration-500"
                style={{ opacity: isInView ? 1 : 0 }}
              >
                {stat.value}
              </span>
            )}
          </span>
          <span className="font-mono text-[0.65rem] text-text-dim uppercase tracking-[0.1em]">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
