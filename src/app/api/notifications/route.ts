import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the user's session data
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Get the user's id
    const id = session?.user?.id;

    if (!id) {
      console.log("User ID not found in session");

      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    // Get the user's notifications
    const notifications = await prisma.notification.findMany({
      where: {
        user: {
          id: id,
        },
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}
