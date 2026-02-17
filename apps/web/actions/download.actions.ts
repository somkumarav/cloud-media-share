"use server";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@repo/utils";
import prisma from "@repo/db";
import { getDecryptedId } from "@repo/utils";

export async function downloadImage(imageId: number) {
  const image = await prisma.media.findUnique({
    where: { id: imageId },
    include: { album: true },
  });

  if (!image) {
    throw new Error("Image not found");
  }

  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET,
    Key: image.storageBucketKey,
    ResponseContentDisposition: `attachment; filename="${image.originalName}"`,
    ResponseContentType: image.mimeType,
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 300,
  });

  return signedUrl;
}

export async function downloadAlbumAsZip(encryptedToken: string) {
  const albumId = getDecryptedId(encryptedToken);

  const album = await prisma.album.findUnique({
    where: { id: albumId },
    include: {
      media: true,
    },
  });

  if (!album) {
    throw new Error("Album not found");
  }

  const downloadURLs = await Promise.all(
    album.media.map(async (image) => {
      const command = new GetObjectCommand({
        Bucket: process.env.BUCKET,
        Key: image.storageBucketKey,
      });

      const signedURL = await getSignedUrl(s3, command, {
        expiresIn: 300,
      });

      return {
        imageURL: signedURL,
        filename: image.originalName,
      };
    }),
  );

  return {
    albumName: album.title,
    images: downloadURLs,
    totalSize: album.totalSize,
  };
}
