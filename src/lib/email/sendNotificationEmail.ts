import nodemailer from "nodemailer";

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
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: "kinzinzombe07@gmail.com",
        pass: "",
      },
    });

    const info = await transporter.sendMail({
      from: `"Freliq" <kinzinzombe@gmail.com>`,
      to,
      subject,
      html: content,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed");
  }
}
