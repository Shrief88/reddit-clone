import { z } from "zod";

export const updateSubredditSchema = z.object({
  description: z
    .string()
    .trim()
    .min(30, {
      message: "Community description must be at least 30 characters long",
    })
    .max(300, {
      message: "Community description must be less than 300 characters long",
    })
    .optional(),
});

export type TUpdateSubredditSchema = z.infer<typeof updateSubredditSchema>;
