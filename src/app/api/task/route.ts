import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Get the task title and description from the request body
    const data = await req.json();
    let { title, description, dueDate, projectId } = data;

    console.log("Body: ", data);

    dueDate = new Date(dueDate).toISOString();

    // Make sure the title and description exist
    if (!title || !description || !dueDate || !projectId) {
      console.log(
        "Missing either title, description, project Id or due date not found",
      );

      return NextResponse.json(
        {
          message:
            "Missing either title, description, project Id or due date not found",
        },
        { status: 400 },
      );
    }

    // Get the user's data
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Create a new task
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
        project: {
          connect: {
            id: projectId,
          },
        },
        creator: {
          connect: {
            id: session?.user?.id || "",
          },
        },
      },
    });

    // Create a new notification
    const newNotification = await prisma.notification.create({
      data: {
        type: "task",
        priority: "low",
        message: `The task "${title} has been created"`,
        user: {
          connect: {
            id: session?.user?.id || "",
          },
        },
      },
    });

    return NextResponse.json({ newTask, newNotification }, { status: 201 });
  } catch (e) {
    console.log("An error occured whie creating task: ", e);

    return NextResponse.json(
      {
        message: "An error occured whie creating task",
      },
      { status: 400 },
    );
  }
}
