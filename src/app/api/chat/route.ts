import {
  streamText,
  UIMessage,
  convertToModelMessages,
  generateText,
  tool,
  stepCountIs,
} from "ai";
import { google } from "@ai-sdk/google";
import { Resend } from "resend";
import { z } from "zod";
import { after } from "next/server";
import { loadContext } from "@/lib/context";
import { getSystemPrompt } from "@/lib/prompts";
import { langfuseSpanProcessor } from "@/instrumentation";

const resend = new Resend(process.env.RESEND_API_KEY!);

async function summarizeConversation(conversation: string): Promise<string> {
  const { text } = await generateText({
    model: google("gemini-3-flash-preview"),
    prompt: `Summarize this recruiter-agent conversation in 3-5 bullet points.
Focus on: what the recruiter asked about, key topics discussed, and any specific interests they expressed.
Keep it concise and actionable for Sam to quickly understand the context.

${conversation}`,
    experimental_telemetry: {
      isEnabled: true,
      functionId: "summarize-conversation",
    },
  });
  return text;
}

function formatEmailHtml(
  recruiterEmail: string,
  message: string,
  summary: string,
): string {
  const summaryItems = summary
    .split("\n")
    .map((line) => line.replace(/^[*\-•]\s*/, "").trim())
    .filter(Boolean)
    .map((line) => `<li>${line}</li>`)
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#ffffff;color:#1a1a1a;line-height:1.6;">
  <div style="max-width:600px;margin:0 auto;">
    <h2 style="font-size:18px;font-weight:600;margin:0 0 12px 0;color:#1a1a1a;">Message from Recruiter</h2>
    <p style="margin:0 0 24px 0;white-space:pre-wrap;">${message}</p>

    <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;">

    <h2 style="font-size:18px;font-weight:600;margin:0 0 12px 0;color:#1a1a1a;">Conversation Summary</h2>
    <ul style="margin:0 0 24px 0;padding-left:20px;">
      ${summaryItems}
    </ul>

    <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;">

    <h2 style="font-size:18px;font-weight:600;margin:0 0 12px 0;color:#1a1a1a;">Contact</h2>
    <p style="margin:0;"><a href="mailto:${recruiterEmail}" style="color:#0066cc;text-decoration:none;">${recruiterEmail}</a></p>
  </div>
</body>
</html>`;
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const context = await loadContext();

  const result = streamText({
    model: google("gemini-3-flash-preview"),
    system: getSystemPrompt(context),
    messages: await convertToModelMessages(messages),
    tools: {
      sendEmail: tool({
        description:
          "Send an email to the real Sam with the recruiter's message and conversation summary. Use this when a recruiter wants to connect directly, express interest, or schedule a conversation.",
        inputSchema: z.object({
          recruiterEmail: z.email("Please provide a valid email address"),
          message: z
            .string()
            .describe("The recruiter's message or reason for reaching out"),
          conversationHistory: z
            .string()
            .describe(
              "The full conversation history between the recruiter and the agent",
            ),
        }),
        execute: async ({
          recruiterEmail,
          message,
          conversationHistory,
        }) => {
          try {
            const recipientEmail =
              process.env.RECIPIENT_EMAIL ?? "samshulman6@gmail.com";
            const fromEmail =
              process.env.FROM_EMAIL ?? "onboarding@resend.dev";

            const summary =
              await summarizeConversation(conversationHistory);
            const html = formatEmailHtml(recruiterEmail, message, summary);

            await resend.emails.send({
              from: fromEmail,
              to: [recipientEmail],
              replyTo: recruiterEmail,
              subject: `Career Twin: Message from recruiter (${recruiterEmail})`,
              html,
            });

            return "Done! I've passed your info along to the real me. I typically respond within 24-48 hours. Thanks for reaching out!";
          } catch (error) {
            console.error(
              JSON.stringify({
                level: "error",
                message: "Failed to send email",
                error:
                  error instanceof Error ? error.message : String(error),
              }),
            );
            return "I wasn't able to send your message due to a technical issue. You can reach me directly at samshulman6@gmail.com. Sorry about that!";
          }
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
    await langfuseSpanProcessor.forceFlush();
  });

  return result.toUIMessageStreamResponse();
}
