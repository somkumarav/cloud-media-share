"use server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prisma from "@repo/db/client";
import { s3 } from "@/lib/s3";
import { decrypt } from "@repo/utils/index";

export async function listImagesInDirectory(encryptedToken: string) {
  const decryptedAlbumId = Number(decrypt(encryptedToken));
  const albumContent = await prisma.media.findMany({
    where: {
      albumId: decryptedAlbumId,
    },
  });

  try {
    const imageObjects = albumContent.filter((obj) => obj.type === "IMAGE");

    const imageURLs = await Promise.all(
      imageObjects.map(async (obj) => {
        const imageName = `${encryptedToken}/${obj.filename}`;
        const thumbnailImageName = `${encryptedToken}/thumbnail-${obj.filename}`;

        const getObjectCommand = new GetObjectCommand({
          Bucket: "test",
          Key: imageName,
        });
        const getThumbnailObjectCommand = new GetObjectCommand({
          Bucket: "test",
          Key: thumbnailImageName,
        });

        const imageURL = await getSignedUrl(s3, getObjectCommand, {
          expiresIn: 36000,
        });
        const thumbnailURL = await getSignedUrl(s3, getThumbnailObjectCommand, {
          expiresIn: 36000,
        });
        return { ...obj, imageURL, thumbnailURL };
      })
    );

    return imageURLs;
  } catch (error) {
    console.error("Error listing objects in R2:", error);
    throw error;
  }
}
