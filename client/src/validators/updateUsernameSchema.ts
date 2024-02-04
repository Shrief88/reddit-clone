import { z } from "zod";

const regexp = /^\S*$/; // a string consisting only of non-whitespaces

export const updateUsernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "Comment cannot be empty" })
    .max(20, { message: "Comment must be less than 20 characters long" })
    .regex(regexp, {
      message: "username name cannot contain whitespaces",
    }),
});

export type TUpdateUsernameSchema = z.infer<typeof updateUsernameSchema>;
