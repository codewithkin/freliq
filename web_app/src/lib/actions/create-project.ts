"use server";

import { revalidatePath } from "next/cache";
import { createProjectSchema } from "@/lib/validators/project";

export async function createProject(formData: FormData) {
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    deadline: formData.get("deadline"),
    clientId: formData.get("clientId"),
    freelancerId: formData.get("freelancerId"),
  };

  const validated = createProjectSchema.safeParse(rawData);

  if (!validated.success) {
    throw new Error("Invalid input");
  }

  const res = await fetch("/api/projects", {
    method: "POST",
    body: JSON.stringify(validated.data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to create project");
  }

  revalidatePath("/projects");
}
