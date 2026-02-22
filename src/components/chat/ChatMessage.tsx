"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { isToolUIPart, getToolName } from "ai";
import type { UIMessage } from "ai";
import type { ComponentPropsWithoutRef } from "react";

interface ChatMessageProps {
  message: UIMessage;
  isStreaming?: boolean;
}

const TOOL_STATUS: Record<string, string> = {
  sendEmail: "sending introduction...",
};

export default function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex flex-col ${isUser ? "items-end self-end" : "items-start self-start"}`}
      style={{ maxWidth: "85%" }}
    >
      <div
        className={
          isUser
            ? "px-3 py-2.5 text-[0.78rem] leading-[1.7] bg-green-dim border border-green/25 font-mono text-green"
            : "px-3 py-2.5 text-[0.84rem] leading-[1.7] bg-surface-2 border border-border text-text font-sans font-light"
        }
      >
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            if (isUser) {
              return (
                <p key={i} className="whitespace-pre-wrap">
                  {part.text}
                </p>
              );
            }
            return (
              <div key={i}>
                <div className="markdown-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {part.text}
                  </ReactMarkdown>
                </div>
                {isStreaming && i === message.parts.length - 1 && (
                  <span className="cursor-blink" aria-hidden="true" />
                )}
              </div>
            );
          }

          if (isToolUIPart(part)) {
            // Only show status while tool is executing, hide once output is available
            if (part.state === "output-available" || part.state === "output-error" || part.state === "output-denied") {
              return null;
            }
            const toolName = getToolName(part);
            const label = TOOL_STATUS[toolName] ?? `running ${toolName}...`;
            return (
              <p
                key={i}
                className="font-mono text-[0.7rem] text-text-muted italic py-1"
              >
                &gt; {label}
              </p>
            );
          }

          return null;
        })}
      </div>

      <span className="font-mono text-[0.55rem] tracking-wider text-text-muted mt-1">
        {isUser ? "> sent" : "~ received"}
      </span>
    </div>
  );
}

const markdownComponents: ComponentPropsWithoutRef<
  typeof ReactMarkdown
>["components"] = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-medium text-text">{children}</strong>
  ),
  em: ({ children }) => <em className="text-text-dim">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-green underline decoration-green/30 hover:decoration-green/60 transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>
  ),
  li: ({ children }) => <li className="text-text">{children}</li>,
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className="block bg-void border border-border p-3 my-2 font-mono text-[0.75rem] text-green overflow-x-auto">
          {children}
        </code>
      );
    }
    return (
      <code className="bg-surface-3 px-1.5 py-0.5 font-mono text-[0.75rem] text-green">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="my-2">{children}</pre>,
  h3: ({ children }) => (
    <h3 className="font-heading font-bold text-sm text-text mt-3 mb-1">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="font-heading font-bold text-sm text-text mt-2 mb-1">
      {children}
    </h4>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-green/30 pl-3 my-2 text-text-dim italic">
      {children}
    </blockquote>
  ),
};
