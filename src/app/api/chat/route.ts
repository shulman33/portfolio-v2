import {
  streamText,
  UIMessage,
  convertToModelMessages,
  generateText,
  Output,
  tool,
  stepCountIs,
} from "ai";
import { google, type GoogleLanguageModelOptions } from "@ai-sdk/google";
import { Resend } from "resend";
import { z } from "zod";
import { after } from "next/server";
import { loadContext } from "@/lib/context";
import { getSystemPrompt } from "@/lib/prompts";
import { langfuseSpanProcessor } from "@/instrumentation";

// Allow streaming responses up to 60 seconds (Hobby tier ceiling).
export const maxDuration = 60;

const MODEL_ID = "gemini-3.7-flash";

const googleOptions = {
  thinkingConfig: { thinkingLevel: "medium" },
} satisfies GoogleLanguageModelOptions;

const MAX_MESSAGES = 40;
const MAX_TOTAL_CHARS = 20_000;

const resend = new Resend(process.env.RESEND_API_KEY!);

function log(level: "info" | "warn" | "error", message: string, extra?: Record<string, unknown>) {
  const line = JSON.stringify({ level, message, ...extra });
  if (level === "error") console.error(line);
  else console.log(line);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Flatten UI messages into a plain-text transcript for summarization. */
function buildTranscript(messages: UIMessage[]): string {
  return messages
    .map((m) => {
      const text = m.parts
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("\n")
        .trim();
      if (!text) return null;
      const speaker = m.role === "user" ? "Visitor" : "Sam (AI)";
      return `${speaker}: ${text}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

/** Strip any markdown the model sneaks into a plain-text bullet. */
function stripMarkdown(line: string): string {
  return line
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/[*_]([^*_]+)[*_]/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^[*\-•]\s*/, "")
    .trim();
}

async function summarizeConversation(transcript: string): Promise<string[]> {
  const { output } = await generateText({
    model: google(MODEL_ID),
    output: Output.object({
      schema: z.object({
        bullets: z
          .array(z.string())
          .min(3)
          .max(5)
          .describe(
            "Plain-text bullet points. No markdown, no bold, no leading dashes or asterisks.",
          ),
      }),
    }),
    prompt: `Summarize this conversation between a website visitor and Sam's AI twin in 3-5 bullet points.
Start with who the visitor seems to be (recruiter, engineer, friend, etc.) if it is clear. Then cover what they asked about, key topics discussed, and any specific interests they expressed.
Keep it concise and actionable for Sam to quickly understand the context.
Write each bullet as one plain sentence. Do not use markdown formatting. Do not include a preamble like "Here is a summary".

${transcript}`,
    providerOptions: { google: googleOptions },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "summarize-conversation",
    },
  });
  return output.bullets.map(stripMarkdown).filter(Boolean);
}

function formatEmailHtml(
  senderEmail: string,
  message: string,
  summary: string[],
): string {
  const summaryItems = summary
    .map((line) => `<li style="margin:0 0 6px 0;">${escapeHtml(line)}</li>`)
    .join("\n");

  const safeEmail = escapeHtml(senderEmail);

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#ffffff;color:#1a1a1a;line-height:1.6;">
  <div style="max-width:600px;margin:0 auto;">
    <h2 style="font-size:18px;font-weight:600;margin:0 0 12px 0;color:#1a1a1a;">Message</h2>
    <p style="margin:0 0 24px 0;white-space:pre-wrap;">${escapeHtml(message)}</p>

    <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;">

    <h2 style="font-size:18px;font-weight:600;margin:0 0 12px 0;color:#1a1a1a;">Conversation Summary</h2>
    <ul style="margin:0 0 24px 0;padding-left:20px;">
      ${summaryItems}
    </ul>

    <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;">

    <h2 style="font-size:18px;font-weight:600;margin:0 0 12px 0;color:#1a1a1a;">Contact</h2>
    <p style="margin:0;"><a href="mailto:${safeEmail}" style="color:#0066cc;text-decoration:none;">${safeEmail}</a></p>
  </div>
</body>
</html>`;
}

async function sendIntroductionEmail(
  senderEmail: string,
  message: string,
  transcript: string,
): Promise<void> {
  const recipientEmail = process.env.RECIPIENT_EMAIL ?? "samshulman6@gmail.com";
  const fromEmail = process.env.FROM_EMAIL ?? "onboarding@resend.dev";

  try {
    const summary = await summarizeConversation(transcript);
    const html = formatEmailHtml(senderEmail, message, summary);

    await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      replyTo: senderEmail,
      subject: `Career Twin: New message from ${senderEmail}`,
      html,
    });

    log("info", "Introduction email sent", { senderEmail });
  } catch (error) {
    log("error", "Failed to send introduction email", {
      senderEmail,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages is required" }, { status: 400 });
  }
  if (messages.length > MAX_MESSAGES) {
    return Response.json({ error: "Conversation too long" }, { status: 413 });
  }
  const transcript = buildTranscript(messages);
  if (transcript.length > MAX_TOTAL_CHARS) {
    return Response.json({ error: "Conversation too long" }, { status: 413 });
  }

  const context = await loadContext();

  // Work deferred until after the response has streamed to the client.
  const deferred: Array<() => Promise<void>> = [];

  const result = streamText({
    model: google(MODEL_ID),
    system: getSystemPrompt(context),
    messages: await convertToModelMessages(messages),
    providerOptions: { google: googleOptions },
    tools: {
      sendEmail: tool({
        description:
          "Send an email to the real Sam with the visitor's message and a summary of this conversation. Use this when someone wants to get in touch with Sam directly, express interest, or set up a conversation. Requires their email address and their message.",
        inputSchema: z.object({
          senderEmail: z.email("Please provide a valid email address"),
          message: z
            .string()
            .describe(
              "The visitor's message: who they are, their role or company if given, and why they are reaching out",
            ),
        }),
        execute: async ({ senderEmail, message }) => {
          deferred.push(() =>
            sendIntroductionEmail(senderEmail, message, transcript),
          );
          return "Done! I've passed your info along to the real me. I typically respond within 24-48 hours. Thanks for reaching out!";
        },
      }),
    },
    stopWhen: stepCountIs(3),
    experimental_telemetry: {
      isEnabled: true,
      functionId: "career-twin-chat",
    },
  });

  after(async () => {
    for (const job of deferred) {
      await job();
    }
    await langfuseSpanProcessor.forceFlush();
  });

  return result.toUIMessageStreamResponse();
}
