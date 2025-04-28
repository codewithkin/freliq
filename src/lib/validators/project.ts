import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  description: z.string().optional(),
  deadline: z.string().optional(), // handle dates as ISO strings
  clientId: z.string().uuid(),
  freelancerId: z.string().uuid().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
