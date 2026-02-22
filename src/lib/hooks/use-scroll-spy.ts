"use client";

import { useState, useEffect } from "react";

export function useScrollSpy(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const visibleSections = new Map<string, boolean>();

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          visibleSections.set(id, entry.isIntersecting);

          // Find the first visible section in DOM order
          for (const sId of sectionIds) {
            if (visibleSections.get(sId)) {
              setActiveId(sId);
              return;
            }
          }
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds]);

  return activeId;
}
