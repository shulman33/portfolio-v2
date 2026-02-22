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

const resend = new Resend(process.env.RESEND_API_KEY!);

async function summarizeConversation(conversation: string): Promise<string> {
  const { text } = await generateText({
    model: google("gemini-3-flash"),
    prompt: `Summarize this recruiter-agent conversation in 3-5 bullet points.
Focus on: what the recruiter asked about, key topics discussed, and any specific interests they expressed.
Keep it concise and actionable for Sam to quickly understand the context.

${conversation}`,
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

  const result = streamText({
    model: google("gemini-3-flash"),
    system: `You are Sam Shulman's AI Career Twin — a friendly, knowledgeable agent that represents Sam professionally. You answer questions about Sam's experience, skills, and interests based on his background. If a recruiter or visitor wants to get in touch with Sam, schedule a conversation, or express interest in his profile, use the sendEmail tool to forward their message. Always collect their email address and a brief message before sending.`,
    messages: await convertToModelMessages(messages),
    tools: {
      sendEmail: tool({
        description:
          "Send an email to Sam with the recruiter's message and conversation summary. Use this when a recruiter wants to get in touch with Sam directly, express interest in his profile, or schedule a conversation.",
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

            return "Your message has been sent to Sam. He typically responds within 24-48 hours. Thanks for reaching out!";
          } catch (error) {
            console.error(
              JSON.stringify({
                level: "error",
                message: "Failed to send email",
                error:
                  error instanceof Error ? error.message : String(error),
              }),
            );
            return "I wasn't able to send your message due to a technical issue. You can reach Sam directly at samshulman6@gmail.com. Sorry for the inconvenience!";
          }
        },
      }),
    },
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse();
}
