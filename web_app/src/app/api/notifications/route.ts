import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    // Get the notifications from the request body
    const { notifications } = await req.json();

    const notificationIds = notifications.map((n: any) => n.id);

    console.log("Notification IDSs: ", notificationIds);

    // Update each of the notifications one-by-one
    const updatedNotifications = await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json(updatedNotifications);
  } catch (error) {
    console.log("An error occured while updating notifications: ", error);

    return NextResponse.json(
      {
        message: "An error occured while updating notifications",
        error,
      },
      { status: 400 },
    );
  }
}

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
