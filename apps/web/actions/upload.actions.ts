"use server";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { withServerActionAsyncCatcher } from "@/lib/async-catch";
import { SuccessResponse } from "@/lib/success";
import { ServerActionReturnType } from "@/types/api.types";
import {
  TDeleteMedia,
  TGetSignedURL,
  TUploadCompleted,
  UploadCompletedSchema,
} from "@/types/media.types";
import { s3 } from "@/lib/s3";
import { GetSignedURLSchema } from "@/types/media.types";
import { ErrorHandler } from "@/lib/error";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prisma from "@repo/db";
import { getDecryptedId, GIGABYTE } from "@repo/utils";
import { addToQueue } from "@repo/queue";

export const getSignedURL = withServerActionAsyncCatcher<
  TGetSignedURL,
  ServerActionReturnType<{ signedURL: string; mediaId: number }>
>(async (args) => {
  const validatedData = GetSignedURLSchema.safeParse(args);

  if (!validatedData.success) {
    throw new ErrorHandler("Data validation failed", "BAD_REQUEST");
  }
  const { fileName, encryptedToken, fileSize, mimeType, checksum } =
    validatedData.data;

  const decryptedAlbumId = getDecryptedId(encryptedToken);

  const albumContent = await prisma.media.groupBy({
    by: ["albumId"],
    where: {
      albumId: decryptedAlbumId,
    },
    _sum: {
      fileSize: true,
    },
  });

  const totalFileSize = albumContent[0]?._sum?.fileSize ?? 0;

  if (BigInt(totalFileSize) + BigInt(fileSize) > GIGABYTE) {
    throw new ErrorHandler(
      "1GB size limit exceeded",
      "INSUFFICIENT_PERMISSIONS"
    );
  }

  const fileAlreadyExist = await prisma.media.findFirst({
    where: {
      albumId: decryptedAlbumId,
      originalName: fileName,
      fileSize: BigInt(fileSize),
    },
  });

  if (fileAlreadyExist) {
    throw new ErrorHandler("File already exists", "BAD_REQUEST");
  }

  const command = new PutObjectCommand({
    Bucket: "test",
    Key: `${encryptedToken}/${fileName}`,
    ContentType: mimeType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
  });

  const signedURL = await getSignedUrl(s3, command, {
    expiresIn: 60,
  });

  const mediaData = await prisma.media.create({
    data: {
      originalName: fileName,
      filename: fileName,
      mimeType,
      fileSize: BigInt(fileSize),
      type: mimeType.startsWith("image/") ? "IMAGE" : "VIDEO",
      storageBucketKey: `${encryptedToken}/${fileName}`,
      albumId: decryptedAlbumId,
      variants: {
        create: [
          {
            filename: fileName,
            fileSize: BigInt(fileSize),
            mimeType,
            format: mimeType.split("/")[1] ?? "",
            storageBucketKey: `${encryptedToken}/${fileName}`,
            type: "ORIGINAL",
          },
        ],
      },
    },
  });

  return new SuccessResponse("Album exists", 201, {
    signedURL,
    mediaId: mediaData.id,
  }).serialize();
});

export const uploadCompleted = withServerActionAsyncCatcher<
  TUploadCompleted,
  ServerActionReturnType<{ imageId: number }>
>(async (args) => {
  const validatedData = await UploadCompletedSchema.safeParseAsync(args);

  if (!validatedData.success) {
    throw new ErrorHandler("Data validation failed", "BAD_REQUEST");
  }
  const req = validatedData.data;

  const mediaData = await prisma.media.update({
    where: { id: req.mediaId },
    data: { status: "PROCESSING" },
  });

  await addToQueue({
    mediaId: req.mediaId.toString(),
    storageBucketKey: mediaData.storageBucketKey,
    action: "EXTRACT_METADATA_AND_PROCESS",
  });

  return new SuccessResponse("Added to queue", 200, {
    imageId: mediaData.id,
  }).serialize();
});

export const deleteMedia = withServerActionAsyncCatcher<
  TDeleteMedia,
  ServerActionReturnType
>(async (args) => {
  const validatedData = await UploadCompletedSchema.safeParseAsync(args);

  if (!validatedData.success) {
    throw new ErrorHandler("Data validation failed", "BAD_REQUEST");
  }
  const req = validatedData.data;

  throw new ErrorHandler("Not implemented", "BAD_REQUEST");

  const mediaData = await prisma.media.delete({
    where: { id: req.mediaId },
    include: { variants: true },
  });
  if (!mediaData) throw new ErrorHandler("Media not found", "BAD_REQUEST");

  mediaData.variants.forEach(async (variant) => {
    const command = new DeleteObjectCommand({
      Bucket: "test",
      Key: variant.storageBucketKey,
    });

    await s3.send(command);
  });

  return new SuccessResponse("Media deleted", 200).serialize();
});
