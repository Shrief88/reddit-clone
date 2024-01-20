import { z } from "zod";

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
    }),
  description: z
    .string()
    .trim()
    .min(30, {
      message: "Community description must be at least 30 characters long",
    })
    .max(200, {
      message: "Community description must be less than 200 characters long",
    }),
});

export type TCreateCommunitySchema = z.infer<typeof createCommunitySchema>;
