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
