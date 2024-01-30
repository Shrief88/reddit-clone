import { z } from "zod";

const regexp = /^\S*$/; // a string consisting only of non-whitespaces

export const createCommunitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, { message: "Community name must be at least 3 characters long" })
    .max(22, {
      message: "Community name must be less than 20 characters long",
    })
    .startsWith("r/", {
      message: "Community name must start with r/",
    })
    .regex(regexp, {
      message: "Community name cannot contain whitespaces",
    }),
  description: z
    .string()
    .trim()
    .min(30, {
      message: "Community description must be at least 30 characters long",
    })
    .max(300, {
      message: "Community description must be less than 300 characters long",
    }),
});

export type TCreateCommunitySchema = z.infer<typeof createCommunitySchema>;
