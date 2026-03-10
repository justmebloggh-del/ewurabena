import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendContactNotificationEmail(payload: {
  name: string;
  email: string;
  message: string;
  organization?: string;
  eventDate?: string;
}) {
  if (!resend || !process.env.CONTACT_NOTIFICATION_EMAIL) {
    return { delivered: false, reason: "Email integration is not configured." };
  }

  await resend.emails.send({
    from: "Ewura Abena Website <noreply@resend.dev>",
    to: process.env.CONTACT_NOTIFICATION_EMAIL,
    subject: `New booking/contact request from ${payload.name}`,
    text: [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Organization: ${payload.organization || "N/A"}`,
      `Event Date: ${payload.eventDate || "N/A"}`,
      "",
      payload.message,
    ].join("\n"),
  });

  return { delivered: true };
}
