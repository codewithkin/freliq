import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const settingsSchema = z.object({
  emailNotifications: z.boolean(),
  projectUpdates: z.boolean(),
  taskReminders: z.boolean(),
  showProfile: z.boolean(),
  showEmail: z.boolean(),
});

// Create default settings when user is created
prisma.$use(async (params, next) => {
  if (params.model === "User" && params.action === "create") {
    const result = await next(params);
    await prisma.settings.create({
      data: {
        userId: result.id,
      },
    });
    return result;
  }
  return next(params);
});

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const settings = await prisma.settings.findUnique({
      where: { userId: session.user.id },
    });

    if (!settings) {
      // Create settings if they don't exist (fallback)
      const newSettings = await prisma.settings.create({
        data: {
          userId: session.user.id,
        },
      });
      return NextResponse.json(newSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const validation = settingsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid settings data" },
        { status: 400 },
      );
    }

    const settings = await prisma.settings.update({
      where: { userId: session.user.id },
      data: validation.data,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
