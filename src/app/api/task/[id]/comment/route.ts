import { auth } from "@/lib/auth";
import { sendNotificationEmail } from "@/lib/email/sendNotificationEmail";
import { prisma } from "@/prisma";
import { task } from "better-auth/react";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { content } = await req.json();
  const { id } = await params;

  // Get the user's session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  if (!content) {
    return NextResponse.json(
      { message: "Comment content is required." },
      { status: 400 },
    );
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        author: {
          connect: {
            id: userId,
          },
        },
        task: {
          connect: {
            id,
          },
        },
      },
    });

    const task = await prisma.task.findUnique({
      where: {
        id,
      },
      include: {
        creator: true,
      },
    });

    if (!task) {
      return NextResponse.json({ message: "Task not found." }, { status: 404 });
    }

    // Notify the other person that a new comment was added
    await prisma.notification.create({
      data: {
        type: "task",
        priority: "high",
        title: `${session?.user?.email} commented on task ${task?.title}`,
        message: `Hey there, just a heads up... ${session?.user?.email} said "${content}" on ${task?.title}`,
        user: {
          connect: {
            id: task?.creatorId,
          },
        },
      },
    });

    // Send a notification email
    await sendNotificationEmail({
      to: task?.creator?.email,
      subject: `${session?.user?.email} commented on task "${task?.title}"`,
      content: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #333;">New Comment on Task: ${task?.title}</h2>
          <p><strong>${session?.user?.email}</strong> wrote:</p>
          <blockquote style="background: #f9f9f9; border-left: 5px solid #ccc; margin: 20px 0; padding: 10px;">
            ${content}
          </blockquote>
          <p>Go check the task for more details!</p>
          <p style="margin-top: 30px; font-size: 0.9em; color: #777;">This is an automated notification from Freliq.</p>
        </div>
      `,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.log("An error occured while adding new comment: ", error);
    return NextResponse.json(
      { message: "Error adding comment." },
      { status: 500 },
    );
  }
}
