import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      console.error("Unauthorized access attempt");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, feedback } = body;

    const allowedStatuses = [
      "DONE",
      "IN_PROGRESS",
      "REJECTED",
      "TODO",
      "AWAITING_REVIEW",
    ];
    if (!allowedStatuses.includes(status)) {
      console.error(`Invalid status: ${status}`);
      return new NextResponse("Invalid status", { status: 400 });
    }

    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      console.error(`Task not found: ${id}`);
      return new NextResponse("Task not found", { status: 404 });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status, feedback },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("PATCH /api/task/[taskId]/status error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
