import { z } from "zod";

export const createCommunitySchema = z.object({
  name: z
    .string()
    .min(5, { message: "Community name must be at least 3 characters long" })
    .max(22, {
      message: "Community name must be less than 20 characters long",
    })
    .startsWith("r/", {
      message: "Community name must start with r/",
    }),
});

export type TCreateCommunitySchema = z.infer<typeof createCommunitySchema>;
