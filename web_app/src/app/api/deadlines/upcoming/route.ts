import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { addDays } from "date-fns";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const now = new Date();
  const inTwoWeeks = addDays(now, 14);

  try {
    const projects = await prisma.project.findMany({
      where: {
        ownerId: userId,
        deadline: {
          gte: now,
          lte: inTwoWeeks,
        },
      },
      select: {
        id: true,
        title: true,
        deadline: true,
      },
      orderBy: {
        deadline: "asc",
      },
    });

    const tasks = await prisma.task.findMany({
      where: {
        creatorId: userId,
        dueDate: {
          gte: now,
          lte: inTwoWeeks,
        },
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        project: { select: { title: true } },
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    const checklists = await prisma.kickoffChecklist.findMany({
      where: {
        userId,
        completed: false,
      },
      select: {
        id: true,
        title: true,
        project: {
          select: { title: true },
        },
      },
    });

    return NextResponse.json({ projects, tasks, checklists });
  } catch (error) {
    console.error("Upcoming deadlines error:", error);
    return NextResponse.json(
      { error: "Failed to fetch upcoming deadlines" },
      { status: 500 },
    );
  }
}
