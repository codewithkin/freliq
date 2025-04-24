import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const updatedTasks: { id: string; status: string }[] = await req.json();

    if (!Array.isArray(updatedTasks)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 },
      );
    }

    const updateOperations = updatedTasks.map((task) =>
      prisma.task.update({
        where: { id: task.id },
        data: { status: task.status },
      }),
    );

    await Promise.all(updateOperations);

    return NextResponse.json(
      { message: "Tasks updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating task statuses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
