// app/api/upload/route.ts (or pages/api/upload.ts if not using App Router)

import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file: File | null = formData.get("proof") as unknown as File;

  if (!file)
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, file.name);

  await writeFile(filePath, buffer);

  return NextResponse.json({ success: true, url: `/uploads/${file.name}` });
}
