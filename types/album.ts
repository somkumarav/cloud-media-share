import { z } from "zod";

export const AlbumNameSchema = z.object({ name: z.string().min(2).max(100) });
export type TAlbumNameSchema = z.infer<typeof AlbumNameSchema>;

export const ChangeAlbumNameSchema = AlbumNameSchema.merge(
  z.object({
    albumId: z.string(),
  })
);
export type TChangeAlbumNameSchema = z.infer<typeof ChangeAlbumNameSchema>;
