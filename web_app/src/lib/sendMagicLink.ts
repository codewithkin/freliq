import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMagicLink(
  { to, magicLinkUrl }: { to: string; magicLinkUrl: string },
  request?: Request | undefined,
) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Freliq <auth@aiseogen.com>",
      to,
      subject: "Your Magic Link is Here ✨",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; color: #0c0c0c; background-color: white; padding: 2rem; border-radius: 12px; max-width: 600px; margin: auto;">
          <h1 style="color: oklch(79.2% 0.209 151.711); font-size: 1.75rem;">Hey there 👋</h1>
          <p style="font-size: 1rem; line-height: 1.6;">
            Ready to jump back in? Your secure magic link is below—just click to get instant access to your Freliq dashboard!
          </p>
          <a href="${magicLinkUrl}" style="display: inline-block; background-color: oklch(79.2% 0.209 151.711); color: white; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: bold; margin: 1rem 0; font-size: 1rem;">
            Sign in to Freliq →
          </a>
          <p style="font-size: 0.9rem; color: #666;">
            This link will expire in 15 minutes for your security.
          </p>
          <hr style="margin: 2rem 0; border: none; border-top: 1px solid oklch(92.5% 0.084 155.995);" />
          <footer style="font-size: 0.8rem; color: #888;">
            Need help? Contact us at <a href="mailto:support@freliq.io" style="color: oklch(79.2% 0.209 151.711); text-decoration: underline;">support@freliq.io</a><br />
            Powered by Freliq ✨
          </footer>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Email failed to send:", error);
      throw new Error("Failed to send magic link.");
    }

    console.log("✅ Magic link sent successfully to", to);
  } catch (err) {
    console.error("Unexpected error in sendMagicLink:", err);
    throw err;
  }
}
