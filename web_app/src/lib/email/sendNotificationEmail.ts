import { transporter } from "./nodemailer";

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
    const info = await transporter.sendMail({
      from: `Freliq <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: content,
    });

    console.log("Message sent successfully to %s", to);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed");
  }
}
