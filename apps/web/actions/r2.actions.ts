"use server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prisma from "@repo/db/client";
import { decrypt } from "@/lib/encryption";

export async function listImagesInDirectory(directory: string) {
  const decryptedAlbumId = Number(decrypt(directory));
  const albumContent = await prisma.albumContents.findMany({
    where: {
      albumId: decryptedAlbumId,
    },
  });

  try {
    const imageObjects = albumContent.filter((obj) => obj.fileType === "image");

    const imageUrls = await Promise.all(
      imageObjects.map(async (obj) => {
        const imageName = `${directory}/${obj.fileName}`;
        const thumbnailImageName = `${directory}/thumbnail-${obj.fileName}`;

        const getObjectCommand = new GetObjectCommand({
          Bucket: "test",
          Key: imageName,
        });
        const getThumbnailObjectCommand = new GetObjectCommand({
          Bucket: "test",
          Key: thumbnailImageName,
        });

        const imageUrl = await getSignedUrl(s3, getObjectCommand, {
          expiresIn: 36000,
        });
        const thumbnailUrl = await getSignedUrl(s3, getThumbnailObjectCommand, {
          expiresIn: 36000,
        });
        return { ...obj, imageUrl, thumbnailUrl };
      })
    );

    return imageUrls;
  } catch (error) {
    console.error("Error listing objects in R2:", error);
    throw error;
  }
}
