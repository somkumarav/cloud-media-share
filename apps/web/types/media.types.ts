import { z } from "zod";

export const GetSignedURLSchema = z.object({
  encryptedToken: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  fileSize: z.number(),
  checksum: z.string(),
});
export type TGetSignedURL = z.infer<typeof GetSignedURLSchema>;

export const UploadCompletedSchema = z.object({
  mediaId: z.number(),
});
export type TUploadCompleted = z.infer<typeof UploadCompletedSchema>;
