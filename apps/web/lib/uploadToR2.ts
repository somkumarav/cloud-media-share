import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@repo/utils";

export const uploadToR2 = async (file: File, fileName: string) => {
  const buffer = await file.arrayBuffer();

  const command = new PutObjectCommand({
    Bucket: "test",
    Key: fileName,
    Body: Buffer.from(buffer),
    ContentType: file.type,
  });

  try {
    await s3.send(command);
    return { success: true, message: "File uploaded successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "File upload failed", error };
  }
};
