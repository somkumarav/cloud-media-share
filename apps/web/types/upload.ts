import { z } from "zod";

export const GetSignedURLSchema = z.object({
  directory: z.string(),
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  checksum: z.string(),
});
export type TGetSignedURL = z.infer<typeof GetSignedURLSchema>;
