import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Get the task title and description from the request body
    const data = await req.json();
    const { title, description, dueDate } = data;

    // Make sure the title and description exist
    if (!title || !description || dueDate) {
      console.log("Missing either title, description or due date not found");

      return NextResponse.json(
        {
          message: "Title or description not found",
        },
        { status: 400 },
      );
    }

    // Create a new task
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
      },
    });

    return NextResponse.json(newTask);
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
