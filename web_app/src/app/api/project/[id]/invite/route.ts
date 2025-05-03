import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { sendNotificationEmail } from "@/lib/email/sendNotificationEmail";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { email, type } = await request.json();
    const { id } = await params;

    // Find the project
    const project = await prisma.project.findUnique({
      where: { id },
      include: { chatRoom: true },
    });

    if (!project) {
      console.log("Project not found: ", project);
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found, please invite them to Freliq first" },
        { status: 404 },
      );
    }

    // Send an invite via email
    await sendNotificationEmail({
      to: email || "",
      subject:
        type === "chat"
          ? "You're invited to chat"
          : "You're invited to join a project",
      content: `
        <div style="font-family: sans-serif; line-height: 1.6">
          <h2>You're Invited to ${
            type === "chat" ? "chat about a project" : "join a project"
          }</h2>
          <p>Hello,</p>
          <p>You have been invited to ${
            type === "chat" ? "join the chat about" : "collaborate on"
          } the project <strong>${project.title}</strong>.</p>
          <p>Click the button below to view and accept the invitation:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/project/${
            project.id
          }/invite?type=${type}" 
             style="display: inline-block; padding: 10px 20px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 4px;">
            ${type === "chat" ? "Join Chat" : "Join Project"}
          </a>
          <p>If you were not expecting this invite, you can ignore this email.</p>
          <br />
          <p>Best regards,</p>
          <p>The Freliq Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Invite error:", error);
    return NextResponse.json(
      { error: "Failed to send invite" },
      { status: 500 },
    );
  }
}
