import { Task } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { seedData } from "@/seed";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // await seedData(user?.id || "");

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const tasks = await prisma.task.findMany({
    where: {
      creatorId: user.id,
    },
    include: {
      project: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(tasks);
}

// Create multiple tasks
export async function POST(req: NextRequest) {
  try {
    // Get the tasks from the request body
    const { tasks } = await req.json();

    if (!tasks) {
      console.log("Tasks not found");
      return NextResponse.json(
        {
          message: "Tasks not found",
        },
        { status: 404 },
      );
    }

    // Create the tasks
    const newTasks = await prisma.task.createMany({
      data: tasks,
    });

    console.log("Newly created tasks: ", tasks);

    return NextResponse.json({ newTasks });
  } catch (e) {
    console.log("An error occured while creating tasks: ", e);
    return NextResponse.json(
      {
        message: "An error occured while creating tasks",
      },
      { status: 400 },
    );
  }
}
