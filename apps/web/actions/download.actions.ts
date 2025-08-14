// app/actions/download.ts (Server Action)
"use server";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import prisma from "@repo/db/client";

export async function downloadImage(imageId: number) {
  const image = await prisma.media.findUnique({
    where: { id: imageId },
    include: { album: true },
  });

  if (!image) {
    throw new Error("Image not found");
  }

  const command = new GetObjectCommand({
    Bucket: "test",
    Key: image.storageBucketKey,
    ResponseContentDisposition: `attachment; filename="${image.originalName}"`,
    ResponseContentType: image.mimeType,
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 300,
  });

  return signedUrl;
}
