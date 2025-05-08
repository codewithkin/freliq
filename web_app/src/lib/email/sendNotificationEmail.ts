import { resend } from "../sendMagicLink";

export async function sendNotificationEmail({
  subject,
  content,
  to,
}: {
  subject: string;
  content: string;
  to: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Freliq <auth@aiseogen.com>",
      to,
      subject,
      html: content,
    });

    if (error) {
      console.error("Failed to send email:", error);
      throw new Error("Email sending failed");
    }

    console.log("Message sent successfully to %s", to);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed");
  }
}
