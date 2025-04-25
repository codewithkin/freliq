import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { taskId: string } },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { taskId } = params;
    const body = await req.json();
    const { status, feedback } = body;

    const allowedStatuses = [
      "DONE",
      "IN_PROGESS",
      "REJECTED",
      "TODO",
      "AWAITING_REVIEW",
    ];
    if (!allowedStatuses.includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return new NextResponse("Task not found", { status: 404 });
    }

    // Optional: You could also check if user is part of the project here
    // or is allowed to update this task

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status, feedback },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("PATCH /api/task/[taskId]/status error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
