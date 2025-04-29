import { auth } from "@/lib/auth";
import { sendNotificationEmail } from "@/lib/email/sendNotificationEmail";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Get the project's data
    let { data } = await req.json();

    // Get the user's data
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user?.id || "",
      },
    });

    if (!user) {
      console.log("User not found in project create route");

      return NextResponse.json(
        {
          message: "User not found in project create route",
        },
        { status: 401 },
      );
    }

    const isFreelancer = user?.type == "freelancer";

    const userId = user?.id;

    data.ownerId = userId;

    if (isFreelancer) {
      data.freelancerId = userId;
    } else {
      data.clientId = userId;
    }

    // Create a new project
    const newProject = await prisma.project.create({
      data,
    });

    // Create a notification
    const newNotification = await prisma.notification.create({
      data: {
        type: "project",
        priority: "medium",
        message: `Project ${data.title} has been created successfully`,
        title: `Project created`,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    // Send an email notification
    await sendNotificationEmail({
      to: user?.email,
      subject: "Project created successfully",
      content: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #2ecc71;">Project Created</h2>
      <p>Hi ${user.name || "there"},</p>
      <p>Your new project titled <strong>${data.title}</strong> has been created successfully.</p>
      <p>You can now start assigning tasks, uploading files, inviting collaborators, and tracking progress in real-time.</p>
      
      <div style="margin-top: 20px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #2ecc71;">
        <p><strong>Project Title:</strong> ${data.title}</p>
        ${
          data.description
            ? `<p><strong>Description:</strong> ${data.description}</p>`
            : ""
        }
        <p><strong>Created By:</strong> ${user.email}</p>
      </div>
  
      <p>
    <a href="https://freliq.com/projects/${newProject.id}" style="color: #2ecc71; text-decoration: none;">
      👉 View Project
    </a>
  </p>
  
  
      <p style="margin-top: 20px;">If you have any questions or need help getting started, feel free to reach out to our support team.</p>
  
      <hr style="margin-top: 30px;">
      <p style="font-size: 0.9em; color: #777;">This is an automated notification from Freliq.</p>
    </div>
  `,
    });

    return NextResponse.json(newProject);
  } catch (e) {
    console.log("Could not create project: ", e);

    return NextResponse.json(
      {
        message: "Could not create project",
      },
      { status: 400 },
    );
  }
}
