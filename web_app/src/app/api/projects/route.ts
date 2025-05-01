import { NextResponse } from "next/server";
import { createProjectSchema } from "@/lib/validators/project";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = session?.user;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const parsed = createProjectSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    const { title, description, deadline, clientId, freelancerId } =
      parsed.data;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        deadline,
        ownerId: user.id,
        clientId,
        freelancerId,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECTS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
