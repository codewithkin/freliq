import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Get the chat id
    const { id } = await params;

    console.log("Chat id: ", id);

    // Find the chat with that id
    const chat = await prisma.chatRoom.findUnique({
      where: {
        id,
      },
      include: {
        messages: {
          include: {
            sender: true,
          },
        },
        users: true,
      },
    });

    if (!chat) {
      console.log("Chat not found: ", id);

      return NextResponse.json({
        message: "Chat not found",
      });
    }

    return NextResponse.json({ chat });
  } catch (e) {
    console.log("An error occured while fetching chat data: ", e);

    return NextResponse.json(
      {
        message: "An error occured while fetching chat data",
      },
      { status: 400 },
    );
  }
}
