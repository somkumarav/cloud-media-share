import { z } from "zod";

export const GetSignedURLSchema = z.object({
  directory: z.string(),
  fileName: z.string(),
});
export type TGetSignedURL = z.infer<typeof GetSignedURLSchema>;
