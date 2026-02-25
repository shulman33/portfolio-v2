"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendContactMessage } from "@/app/actions";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    { success: false } as { success: boolean; error?: string }
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && formRef.current) {
      const timer = setTimeout(() => {
        formRef.current?.reset();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {/* Honeypot — invisible to humans, bots auto-fill it */}
      <div className="absolute opacity-0 h-0 w-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label
          htmlFor="contact-name"
          className="block font-mono text-[0.58rem] text-text-muted uppercase tracking-wider mb-1.5"
        >
          name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          maxLength={200}
          placeholder="Your name"
          className="w-full bg-surface-2 border border-border font-mono text-[0.82rem] text-text px-4 py-3 placeholder:text-text-muted focus:border-green/35 focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="block font-mono text-[0.58rem] text-text-muted uppercase tracking-wider mb-1.5"
        >
          email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          maxLength={320}
          placeholder="you@example.com"
          className="w-full bg-surface-2 border border-border font-mono text-[0.82rem] text-text px-4 py-3 placeholder:text-text-muted focus:border-green/35 focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block font-mono text-[0.58rem] text-text-muted uppercase tracking-wider mb-1.5"
        >
          message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          maxLength={5000}
          placeholder="Your message..."
          className="w-full bg-surface-2 border border-border font-mono text-[0.82rem] text-text px-4 py-3 placeholder:text-text-muted focus:border-green/35 focus:outline-none transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="font-mono text-[0.75rem] tracking-wider bg-green text-void px-6 py-3 hover:shadow-[var(--green-glow)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "sending..." : "./send_message"}
      </button>

      {state.success && (
        <p className="font-mono text-[0.72rem] text-green">message sent</p>
      )}
      {state.error && (
        <p className="font-mono text-[0.72rem] text-red">{state.error}</p>
      )}
    </form>
  );
}
