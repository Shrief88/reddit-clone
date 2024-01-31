import { z } from "zod";

export const createCommentSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, { message: "Comment cannot be empty" })
    .max(2000, { message: "Comment must be less than 2000 characters long" }),
  replyToId : z.string().optional(),
});

export type TCreateCommentSchema = z.infer<typeof createCommentSchema>;
