"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  try {
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
    console.error(
      JSON.stringify({
        event: "contact_form_error",
        error: err instanceof Error ? err.message : "Unknown error",
        timestamp: new Date().toISOString(),
      })
    );
    return { success: false, error: "Failed to send message. Please try again." };
  }
}
