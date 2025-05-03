import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { sendNotificationEmail } from "@/lib/email/sendNotificationEmail";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { email, type } = await request.json();
    const projectId = params.id;

    // Find the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { chatRoom: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Find or create user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add user to project members
    await prisma.projectMembers.create({
      data: {
        userId: user.id,
        projectId,
      },
    });

    // If type is chat, add to chat room
    if (type === "chat" && project.chatRoom) {
      await prisma.chatRoom.update({
        where: { id: project.chatRoom.id },
        data: {
          users: {
            connect: { id: user.id },
          },
        },
      });
    }

    // Send email notification
    await sendNotificationEmail({
      to: email,
      subject: `You've been invited to ${project.title}`,
      content: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #2e865f;">
          <h2>You're Invited to Collaborate</h2>
          <p>Hello,</p>
          <p>You have been invited to collaborate on <strong>${project.title}</strong>.</p>
          <p>Login to view and start collaborating on the project.</p>
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
