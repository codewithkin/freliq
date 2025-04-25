import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { content } = await req.json();

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
      },
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
