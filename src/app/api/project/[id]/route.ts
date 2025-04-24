import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const searchParams = req.nextUrl.searchParams;
  const projectId = searchParams.get("id");

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId || "" },
      include: {
        owner: {
          select: { id: true, name: true, image: true },
        },
        members: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            dueDate: true,
          },
          orderBy: { createdAt: "asc" },
        },
        files: {
          select: {
            id: true,
            name: true,
            url: true,
            type: true,
          },
        },
        checklists: {
          select: {
            id: true,
            title: true,
            completed: true,
          },
        },
      },
    });

    if (!project) {
      return new NextResponse(JSON.stringify({ error: "Project not found" }), {
        status: 404,
      });
    }

    // Optional: authorize user (must be owner or member)
    const isMemberOrOwner =
      project.owner.id === session.user.id ||
      project.members.some((m) => m.user.id === session.user.id);

    if (!isMemberOrOwner) {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECT_GET_ERROR]", error);
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
