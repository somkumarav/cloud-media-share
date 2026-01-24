import { z } from "zod";

export const GetSignedURLSchema = z.object({
  encryptedToken: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  fileSize: z.number(),
  checksum: z.string().nullable(),
});
export type TGetSignedURL = z.infer<typeof GetSignedURLSchema>;

export const UploadCompletedSchema = z.object({
  mediaId: z.number(),
});
export type TUploadCompleted = z.infer<typeof UploadCompletedSchema>;

export const ChangeMediaNameSchema = z.object({
  mediaId: z.number(),
  newName: z.string().min(2),
});
export type TChangeMediaName = z.infer<typeof ChangeMediaNameSchema>;

export const DeleteMediaSchema = z.object({
  mediaId: z.number(),
});
export type TDeleteMedia = z.infer<typeof DeleteMediaSchema>;
