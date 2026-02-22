"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState, useCallback, type FormEvent } from "react";
import type { UIMessage } from "ai";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { getStoredMessages, useChatPersistence } from "./useChatSession";

const WELCOME_MESSAGE_TEXT = `// initializing career_twin_agent...\n\nHello! I'm Sam's career twin — I have full context on his professional story, projects, and technical thinking. What would you like to know?`;

const SUGGESTIONS = [
  "what are you building?",
  "tell me about AI work",
  "tech stack?",
  "connect me with sam",
];

export default function ChatWidget() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [booted, setBooted] = useState(false);
  const [input, setInput] = useState("");
  const sessionRestoredRef = useRef(false);
  const { persistMessages } = useChatPersistence();

  const {
    messages,
    setMessages,
    sendMessage,
    regenerate,
    status,
    error,
  } = useChat();

  const isLoading = status === "streaming" || status === "submitted";

  // Derive UI state from messages array — no separate state needed
  const hasMessages = messages.length > 0;

  // Restore session from sessionStorage after mount
  useEffect(() => {
    const stored = getStoredMessages();
    if (stored.length > 0) {
      setMessages(stored);
    }
    sessionRestoredRef.current = true;
  }, [setMessages]);

  // Persist messages to sessionStorage (only after session is restored)
  useEffect(() => {
    if (!sessionRestoredRef.current) return;
    if (messages.length > 0) {
      persistMessages(messages);
    }
  }, [messages, persistMessages]);

  // Boot sequence animation via IntersectionObserver
  useEffect(() => {
    const el = widgetRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      requestAnimationFrame(() => setBooted(true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setBooted(true), 150);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-scroll to newest message (instant during streaming to avoid jitter)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: isLoading ? "instant" : "smooth",
    });
  }, [messages, isLoading]);

  // Welcome message shown when no conversation has started
  const welcomeMessage: UIMessage = {
    id: "welcome",
    role: "assistant",
    parts: [{ type: "text" as const, text: WELCOME_MESSAGE_TEXT }],
    createdAt: new Date(),
  } as UIMessage;

  const displayMessages: UIMessage[] = hasMessages
    ? messages
    : [welcomeMessage];

  const lastAssistantId = [...messages]
    .reverse()
    .find((m) => m.role === "assistant")?.id;

  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim() || isLoading) return;
      setInput("");
      sendMessage({ text: text.trim() });
    },
    [isLoading, sendMessage],
  );

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSend(input);
  }

  return (
    <div
      ref={widgetRef}
      className="w-full flex flex-col bg-surface border border-border transition-all duration-500 ease-out"
      style={{
        height: "min(560px, 70vh)",
        opacity: booted ? 1 : 0,
        transform: booted ? "translateY(0)" : "translateY(20px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3.5 px-4 py-3 border-b border-border bg-surface-2">
        <div className="w-8 h-8 bg-green-dim border border-green/35 flex items-center justify-center font-mono text-[0.75rem] text-green shrink-0">
          S
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading text-[0.88rem] font-semibold text-text tracking-[0.01em]">
            Career Twin
          </p>
          <p className="font-mono text-[0.6rem] text-green tracking-wider">
            ai-powered agent // always online
          </p>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[0.6rem] text-green tracking-wider status-pulse">
          ACTIVE
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 min-h-0 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-border">
        {displayMessages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isStreaming={status === "streaming" && message.id === lastAssistantId}
          />
        ))}

        {/* Thinking indicator — shown after send, before streaming starts */}
        {status === "submitted" && (
          <div
            className="flex flex-col items-start self-start"
            style={{ maxWidth: "85%" }}
          >
            <div className="px-3 py-2.5 bg-surface-2 border border-border">
              <div className="flex items-center gap-1.5">
                <span className="typing-dot" />
                <span className="typing-dot [animation-delay:0.15s]" />
                <span className="typing-dot [animation-delay:0.3s]" />
              </div>
            </div>
            <span className="font-mono text-[0.55rem] tracking-wider text-text-muted mt-1">
              ~ thinking
            </span>
          </div>
        )}

        {/* Error bubble */}
        {error && (
          <div className="px-3 py-2.5 border border-[rgba(255,95,87,0.3)] bg-surface-2 text-[0.84rem] font-sans font-light text-text leading-[1.7]">
            <p>
              Something went wrong. Try again or reach Sam directly at{" "}
              <a
                href="mailto:samshulman6@gmail.com"
                className="text-green underline decoration-green/30"
              >
                samshulman6@gmail.com
              </a>
            </p>
            <button
              onClick={() => regenerate()}
              className="mt-2 px-3 py-1 font-mono text-[0.65rem] border border-border text-text-dim hover:border-green/40 hover:text-green transition-colors cursor-pointer bg-transparent tracking-wider"
            >
              retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion pills — shown only when no messages yet */}
      {!hasMessages && (
        <div className="flex gap-1.5 px-4 py-2.5 overflow-x-auto border-t border-border bg-surface-2 [&::-webkit-scrollbar]:h-0">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              disabled={isLoading}
              className="whitespace-nowrap px-3 py-1.5 font-mono text-[0.65rem] tracking-wider bg-transparent border border-border text-text-dim cursor-pointer transition-colors hover:border-green/40 hover:text-green disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="px-4 py-3 border-t border-border bg-surface">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleFormSubmit}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
