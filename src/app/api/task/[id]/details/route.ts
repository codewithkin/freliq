import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Route handler for updating task details
const updateTaskDetails = async (
  req: NextRequest,
  taskId: string,
  userId: string,
) => {
  const { title, description, feedback } = await req.json();

  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(feedback && { feedback }),
      },
    });

    return task;
  } catch (error) {
    console.error("Error updating task:", error);
    return null;
  }
};

// Route handler to update task details
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id: taskId } = params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  // Only allow updates for tasks that belong to the authenticated user
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { creator: true },
    });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    if (!user?.id) {
      throw new Error("ID not found");
    }

    if (task.creatorId !== user?.id) {
      return NextResponse.json(
        { message: "You don't have permission to update this task" },
        { status: 403 },
      );
    }

    // Proceed with updating task details
    const updatedTask = await updateTaskDetails(req, taskId, user?.id);
    if (updatedTask) {
      return NextResponse.json(updatedTask, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Error updating task details" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error processing the task:", error);
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 500 },
    );
  }
}
