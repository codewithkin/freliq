import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/prisma";

export async function GET() {
  try {
    // Get the user's session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Get the user's id
    const id = session?.user?.id;

    // Get all of the user's projects
    const projects = await prisma.project.findMany({
      where: {
        ownerId: id,
      },
      include: {
        tasks: true,
        files: true,
        owner: true,
        members: true,
        checklists: true,
        chatRoom: true,
      },
    });

    return NextResponse.json(projects);
  } catch (e) {
    console.log("An error occured while getting projects: ", e);

    return NextResponse.json(
      {
        message: "An error occured while getting projects",
      },
      { status: 400 },
    );
  }
}
