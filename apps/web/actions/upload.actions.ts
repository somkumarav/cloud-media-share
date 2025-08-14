"use server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { withServerActionAsyncCatcher } from "@/lib/async-catch";
import { SuccessResponse } from "@/lib/success";
import { ServerActionReturnType } from "@/types/api.types";
import {
  TGetSignedURL,
  TUploadCompleted,
  UploadCompletedSchema,
} from "@/types/upload";
import { s3 } from "@/lib/s3";
import { GetSignedURLSchema } from "@/types/upload";
import { ErrorHandler } from "@/lib/error";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prisma from "@repo/db/client";
import { getDecryptedId } from "@repo/utils/index";
import { addToQueue } from "@repo/queue/index";
import { GIGABYTE } from "@repo/utils/index";

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

  const decryptedAlbumId = Number(getDecryptedId(encryptedToken));

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
  ServerActionReturnType
>(async (args) => {
  const validatedData = await UploadCompletedSchema.safeParseAsync(args);

  if (!validatedData.success) {
    throw new ErrorHandler("Data validation failed", "BAD_REQUEST");
  }
  const req = validatedData.data;

  const mediaData = await prisma.media.update({
    where: { id: req.mediaId },
    data: { status: "PENDING" },
  });

  await addToQueue({
    mediaId: req.mediaId.toString(),
    storageBucketKey: mediaData.storageBucketKey,
    action: "EXTRACT_METADATA_AND_PROCESS",
  });

  return new SuccessResponse("Added to queue", 200).serialize();
});
