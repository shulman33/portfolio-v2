"use client";

import {
  useRef,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  disabled: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) {
        e.currentTarget.form?.requestSubmit();
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-2.5">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="// ask about experience, projects, or skills"
        rows={1}
        maxLength={2000}
        className="flex-1 resize-none bg-surface-2 border border-border px-3.5 py-2 font-mono text-[0.78rem] text-text placeholder:text-text-muted focus:border-[rgba(0,232,122,0.35)] focus:outline-none disabled:opacity-50 leading-relaxed transition-colors"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="shrink-0 w-9 h-9 flex items-center justify-center bg-green border-none cursor-pointer transition-shadow hover:shadow-[var(--green-glow)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
        aria-label="Send message"
      >
        <Send size={14} className="text-void" strokeWidth={2.5} />
      </button>
    </form>
  );
}
