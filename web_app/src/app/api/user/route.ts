import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema
const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  bio: z.string().max(500).optional(),
  occupation: z.string().max(100).optional(),
  website: z.string().url("Invalid URL").or(z.literal("")).optional(),
});

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
      include: {
        polls: true,
        projects: true,
        checklists: true,
        tasks: true,
        files: true,
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

export async function PUT(req: NextRequest) {
  try {
    // Get the user id from better-auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized: User not found",
        },
        { status: 401 },
      );
    }

    const id = user?.id;
    const body = await req.json();

    // Validate the input
    const validation = updateUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error.errors,
        },
        { status: 400 },
      );
    }

    // Sanitize the data (empty strings become null)
    const sanitizedData = {
      name: validation.data.name,
      bio: validation.data.bio || null,
      occupation: validation.data.occupation || null,
      website: validation.data.website || null,
    };

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: sanitizedData,
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (e) {
    console.log("An error occured while updating user data: ", e);

    return NextResponse.json(
      {
        message: "An error occured while updating user data",
      },
      { status: 500 },
    );
  }
}
