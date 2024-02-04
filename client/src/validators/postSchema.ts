import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(120, { message: "Title must be less than 50 characters long" }),
  subredditId: z.any(),
  content: z.any(),
  image: z.any(),
});

export type TPostSchema = z.infer<typeof postSchema>;
