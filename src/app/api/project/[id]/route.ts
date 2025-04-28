import { auth } from "@/lib/auth";
import { sendNotificationEmail } from "@/lib/email/sendNotificationEmail";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id: projectId } = await params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId || "" },
      include: {
        chatRoom: true,
        owner: {
          select: { id: true, name: true, image: true },
        },
        members: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            dueDate: true,
          },
          orderBy: { createdAt: "asc" },
        },
        files: {
          select: {
            id: true,
            name: true,
            url: true,
            type: true,
          },
        },
        checklists: {
          select: {
            id: true,
            title: true,
            completed: true,
          },
        },
      },
    });

    if (!project) {
      return new NextResponse(JSON.stringify({ error: "Project not found" }), {
        status: 404,
      });
    }

    // Optional: authorize user (must be owner or member)
    const isMemberOrOwner =
      project.owner.id === session.user.id ||
      project.members.some((m) => m.user.id === session.user.id);

    if (!isMemberOrOwner) {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECT_GET_ERROR]", error);
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id: projectId } = await params;

  try {
    // Retrieve the project to ensure it exists
    const project = await prisma.project.findUnique({
      where: { id: projectId || "" },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
        tasks: true,
        files: true,
        checklists: true,
        chatRoom: true,
      },
    });

    if (!project) {
      return new NextResponse(JSON.stringify({ error: "Project not found" }), {
        status: 404,
      });
    }

    // Optional: authorize user (must be owner or member)
    const isMemberOrOwner =
      project.owner.id === session.user.id ||
      project.members.some((m) => m.user.id === session.user.id);

    if (!isMemberOrOwner) {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });
    }

    // Start deleting related records:
    // Delete chat room messages if any
    if (project.chatRoom) {
      await prisma.message.deleteMany({
        where: { chatRoomId: project.chatRoom.id },
      });

      // Delete the chat room itself
      await prisma.chatRoom.delete({
        where: { id: project.chatRoom.id },
      });
    }

    // Delete all project members
    await prisma.projectMembers.deleteMany({
      where: { projectId: projectId },
    });

    // Delete all project tasks and associated files
    await prisma.task.deleteMany({
      where: { projectId: projectId },
    });

    // Delete all project files
    await prisma.file.deleteMany({
      where: { projectId: projectId },
    });

    // Delete all project checklists
    await prisma.kickoffChecklist.deleteMany({
      where: { projectId: projectId },
    });

    // Finally, delete the project itself
    await prisma.project.delete({
      where: { id: projectId },
    });

    // Create a notification
    await prisma.notification.create({
      data: {
        type: "project",
        priority: "high",
        message: `Project "${project.title}" has been deleted.`,
        user: {
          connect: {
            id: project.owner.id,
          },
        },
      },
    });

    // Send notification email here
    // ✅ Send notification email
    await sendNotificationEmail({
      to: project.owner.email, // <-- assuming 'email' is part of owner
      subject: `Your project "${project.title}" has been deleted`,
      content: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #c0392b;">Project Deleted</h2>
              <p>Hi ${project.owner.name || "there"},</p>
              <p>Your project titled <strong>${project.title}</strong> has been deleted successfully by <strong>${session.user.email}</strong>.</p>
              <p>If this wasn't you or you have questions, please contact support immediately.</p>
              <hr style="margin-top: 30px;">
              <p style="font-size: 0.9em; color: #777;">This is an automated notification from Freliq.</p>
            </div>
          `,
    });

    return new NextResponse(
      JSON.stringify({ message: "Project successfully deleted" }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("[PROJECT_DELETE_ERROR]", error);
    return new NextResponse(
      JSON.stringify({
        error: "Something went wrong while deleting the project",
      }),
      {
        status: 500,
      },
    );
  }
}
