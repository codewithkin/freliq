import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Fetch chats
export async function GET(req: NextRequest) {
  try {
    // Get the user's data
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = session?.user;

    if (!user) {
      console.log("Unauthorized");

      return NextResponse.json(
        {
          messagge: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // Get the user's chats
    const chats = await prisma.chatRoom.findMany({
      where: {
        users: {
          some: {
            id: user.id,
          },
        },
      },
      include: {
        users: true,
        messages: true,
        project: true,
      },
    });

    return NextResponse.json({ chats });
  } catch (e) {
    console.log("Failed to fetch chats: ", e);

    return NextResponse.json(
      {
        message: "Failed to fetch chats",
      },
      { status: 400 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get the project id from the request body
    const data = await req.json();

    const projectId = data.projectId;

    if (!projectId) {
      console.log("Missing params: ", data);

      return NextResponse.json(
        {
          message: "Could not find projectId",
        },
        { status: 404 },
      );
    }

    // Get the user's session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Destructure the user object
    const user = session?.user;

    if (!user?.id) throw new Error("User ID is required");

    // Create a new chatRoom

    const chatRoom = await prisma.chatRoom.create({
      data: {
        project: {
          connect: {
            id: projectId,
          },
        },
        users: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        users: true,
        messages: true,
        project: true,
      },
    });

    return NextResponse.json({ chatRoom });
  } catch (e) {
    console.log("Could not create project: ", e);

    return NextResponse.json(
      {
        message: "Could not create project",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Get the chat's id
    const searchParams = req.nextUrl.searchParams;

    const id = searchParams.get("id");

    if (!id) {
      console.log("ERROR: ID not found");

      return NextResponse.json(
        {
          message: "ERROR: ID not found",
        },
        { status: 404 },
      );
    }

    // Delete the chatRoom
    await prisma.chatRoom.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Chat deleted successfully",
    });
  } catch (e) {
    console.log("Failed to delete chat: ", e);

    return NextResponse.json(
      {
        message: "Failed to delete chat",
      },
      { status: 400 },
    );
  }
}
