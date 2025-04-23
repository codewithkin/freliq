import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get the user id from better-auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = session?.user;

    if (!user) {
      console.log(
        "An error occured while getting user data: User does not exist",
      );

      return NextResponse.json(
        {
          message: "An error occured while getting user data, user not found",
        },
        { status: 400 },
      );
    }

    const id = user?.id;

    // Get the user's full data
    const fullUser = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    return NextResponse.json({ fullUser });
  } catch (e) {
    console.log("An error occured while getting user data: ", e);

    return NextResponse.json(
      {
        message: "An error occured while getting user data",
      },
      { status: 400 },
    );
  }
}
