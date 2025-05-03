import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type = "project" } = await request.json();
    const projectId = params.id;

    // Find the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { chatRoom: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // For chat invites, check if they're already in chat
    if (type === "chat") {
      if (!project.chatRoom) {
        return NextResponse.json(
          { error: "Chat room not found" },
          { status: 404 },
        );
      }

      // Check if user is already in chat
      const chatMember = await prisma.chatRoom.findFirst({
        where: {
          id: project.chatRoom.id,
          users: {
            some: {
              id: session.user.id,
            },
          },
        },
      });

      if (chatMember) {
        return NextResponse.json(
          { error: "Already a member of this chat" },
          { status: 400 },
        );
      }

      // Add user to chat room
      await prisma.chatRoom.update({
        where: { id: project.chatRoom.id },
        data: {
          users: {
            connect: { id: session.user.id },
          },
        },
      });

      return NextResponse.json({ success: true });
    }

    // For project invites, check if they're already a member
    const existingMember = await prisma.projectMembers.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: project.id,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "Already a member of this project" },
        { status: 400 },
      );
    }

    // Add user to project members
    await prisma.projectMembers.create({
      data: {
        userId: session.user.id,
        projectId: project.id,
      },
    });

    // Also add to chat room if it exists
    if (project.chatRoom) {
      await prisma.chatRoom.update({
        where: { id: project.chatRoom.id },
        data: {
          users: {
            connect: { id: session.user.id },
          },
        },
      });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Join project error:", error);
    return NextResponse.json(
      { error: "Failed to join project" },
      { status: 500 },
    );
  }
}
