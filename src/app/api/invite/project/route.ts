import { auth } from "@/lib/auth";
import { sendNotificationEmail } from "@/lib/email/sendNotificationEmail";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get the query params
    const searchParams = await req.nextUrl.searchParams;

    const email = searchParams.get("email");

    // Get the project id from query params
    const projectId = searchParams.get("project");

    console.log("Data: ", { email, projectId });

    // Get the project's data
    const project = await prisma.project.findUnique({
      where: {
        id: projectId || "",
      },
    });

    if (!project) {
      console.log("Project does not exist");

      return NextResponse.json(
        {
          message: "Project does not exist",
        },
        { status: 400 },
      );
    }

    // Send an invite via email
    await sendNotificationEmail({
      to: email || "",
      subject: `You're invited to join the project "${project.title}"`,
      content: `
          <div style="font-family: sans-serif; line-height: 1.6">
            <h2>You're Invited to Collaborate</h2>
            <p>Hello,</p>
            <p>You have been invited to join the project <strong>${project.title}</strong>.</p>
            <p>Click the button below to view and accept the invitation:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/project/${project.id}/invite" 
               style="display: inline-block; padding: 10px 20px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 4px;">
              View Project
            </a>
            <p>If you were not expecting this invite, you can ignore this email.</p>
            <br />
            <p>Best regards,</p>
            <p>The Freliq Team</p>
          </div>
        `,
    });

    // Get the user's data
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Create a notification
    const newNotification = await prisma.notification.create({
      data: {
        type: "project",
        title: "Project invite sent",
        message: `${email} has been invited to project "${project.title}" successfully`,
        priority: "low",
        user: {
          connect: {
            id: session?.user?.id || "",
          },
        },
      },
    });

    return NextResponse.json({
      message: `${email} has been invited to project successfully`,
    });
  } catch (e) {
    console.log("An error occured while inviting user: ", e);

    return NextResponse.json(
      {
        message: "An error occured while inviting user",
      },
      { status: 400 },
    );
  }
}
