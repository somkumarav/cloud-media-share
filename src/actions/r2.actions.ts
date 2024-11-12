"use server";
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function listImagesInDirectory(directory: string) {
  const command = new ListObjectsV2Command({
    Bucket: "test",
    Prefix: `${directory}/thumbnail-`,
  });

  try {
    const response = await s3.send(command);
    const objects = response.Contents || [];

    const imageObjects = objects.filter((obj) =>
      obj.Key?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)
    );

    const imageUrls = await Promise.all(
      imageObjects.map(async (obj) => {
        const imageName = obj.Key?.replace("thumbnail-", "");
        const thumbnailImageName = obj.Key;

        const getObjectCommand = new GetObjectCommand({
          Bucket: "test",
          Key: imageName,
        });
        const getThumbnailObjectCommand = new GetObjectCommand({
          Bucket: "test",
          Key: thumbnailImageName,
        });

        const url = await getSignedUrl(s3, getObjectCommand, {
          expiresIn: 36000,
        });
        const thumbnailUrl = await getSignedUrl(s3, getThumbnailObjectCommand, {
          expiresIn: 36000,
        });
        return { key: obj.Key!, url, thumbnailUrl };
      })
    );

    return imageUrls;
  } catch (error) {
    console.error("Error listing objects in R2:", error);
    throw error;
  }
}
