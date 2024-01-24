import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(120, { message: "Title must be less than 50 characters long" }),
  subredditId: z.string(),
  content: z.any(),
});

export type TCreatePostSchema = z.infer<typeof createPostSchema>;
