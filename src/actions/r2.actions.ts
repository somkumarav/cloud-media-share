"use server";
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { uploadToR2 } from "@/lib/uploadToR2";
import { s3 } from "@/lib/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";

export async function getObjectFromR2(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    const response = await s3.send(command);
    const arrayBuffer = await response.Body?.transformToByteArray();

    if (!arrayBuffer) {
      throw new Error("Failed to retrieve object from R2");
    }

    // Convert ArrayBuffer to Base64
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return base64;
  } catch (error) {
    console.error("Error retrieving object from R2:", error);
    throw error;
  }
}

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

export async function uploadImageToR2(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  const fileName = `som/${file.name}`;
  const res = await uploadToR2(file, fileName);

  if (res.success) {
    return { success: true, message: "File upload failed", data: fileName };
  } else {
    return { success: false, message: "File upload failed" };
  }
}

export async function uploadImagesToR2(formData: FormData) {
  const files = formData.getAll("files") as File[];
  const directory = formData.get("directory");
  if (files.length === 0) {
    throw new Error("No files provided");
  }

  const results = await Promise.all(
    files.map(async (file) => {
      const fileName = `${directory}/${file.name}`;
      const res = await uploadToR2(file, fileName);

      if (res.success) {
        return {
          fileName: fileName,
          success: true,
          message: "File uploaded successfully",
        };
      } else {
        return {
          fileName: fileName,
          success: false,
          message: "Failed to upload file",
        };
      }
    })
  );

  revalidatePath("/album/[id]", "page");
  return results;
}
