// /app/api/onboarding/route.ts
import { NextRequest, NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/prisma";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const bio = formData.get("bio") as string;
  const occupation = formData.get("occupation") as string;
  const website = formData.get("website") as string;
  const file = formData.get("image") as File | null;

  try {
    let imageUrl: string | undefined = undefined;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `avatars/${session.user.id}-${Date.now()}.webp`;
      imageUrl = await uploadToR2(fileName, buffer, file.type);
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        bio,
        occupation,
        website,
        ...(imageUrl && { image: imageUrl }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
