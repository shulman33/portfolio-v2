"use client";

import { useCallback } from "react";
import type { UIMessage } from "ai";

const SESSION_KEY = "career-twin-messages";

/** Read stored messages from sessionStorage. Safe to call client-side only. */
export function getStoredMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as UIMessage[]) : [];
  } catch {
    return [];
  }
}

export function useChatPersistence() {
  const persistMessages = useCallback((messages: UIMessage[]) => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
    } catch {
      // sessionStorage full or blocked — silently ignore
    }
  }, []);

  return { persistMessages };
}
