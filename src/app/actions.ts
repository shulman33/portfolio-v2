"use server";

import { Resend } from "resend";

interface ContactFormState {
  success: boolean;
  error?: string;
}

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  // Validation
  if (!name || !name.trim()) {
    return { success: false, error: "Name is required." };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "A valid email is required." };
  }
  if (!message || !message.trim()) {
    return { success: false, error: "Message is required." };
  }

  if (!process.env.RESEND_API_KEY) {
    console.error(
      JSON.stringify({
        event: "contact_form_error",
        error: "RESEND_API_KEY environment variable is not configured",
        timestamp: new Date().toISOString(),
      })
    );
    return {
      success: false,
      error: "Email service is not configured. Please contact sam@shulman.dev directly.",
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // NOTE: "onboarding@resend.dev" is Resend's test sender.
    // It can only deliver to the email address on your Resend account.
    // For production, verify your domain in Resend and use e.g. "contact@shulman.dev".
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "sam@shulman.dev",
      subject: `Portfolio contact from ${name.trim()}`,
      replyTo: email.trim(),
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    });

    console.log(
      JSON.stringify({
        event: "contact_form_submission",
        name: name.trim(),
        email: email.trim(),
        timestamp: new Date().toISOString(),
      })
    );

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorDetails =
      err && typeof err === "object" && "statusCode" in err
        ? { statusCode: (err as { statusCode: number }).statusCode }
        : {};

    console.error(
      JSON.stringify({
        event: "contact_form_error",
        error: errorMessage,
        ...errorDetails,
        timestamp: new Date().toISOString(),
      })
    );

    return {
      success: false,
      error: "Failed to send message. Please try again or email sam@shulman.dev directly.",
    };
  }
}
