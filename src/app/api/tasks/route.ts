import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const tasks = await prisma.task.findMany({
    where: {
      creatorId: user.id,
    },
    include: {
      project: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(tasks);
}
