import { sendNotificationEmail } from "@/lib/email/sendNotificationEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, peerId, senderName } = await req.json();

  if (!email || !peerId || !senderName) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  await sendNotificationEmail({
    to: email,
    subject: `${senderName} invited you to a call`,
    content: `<p>${senderName} has invited you to join a video call.</p>
           <p>Click the link below to join:</p>
           <a href="${process.env.NEXT_PUBLIC_APP_URL}/messages/${req.nextUrl.searchParams.get(
             "chatId",
           )}?peerId=${peerId}">Join Call</a>`,
  });

  return NextResponse.json({ success: true });
}
