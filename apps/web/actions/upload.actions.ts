"use server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { withServerActionAsyncCatcher } from "@/lib/async-catch";
import { SuccessResponse } from "@/lib/success";
import { ServerActionReturnType } from "@/types/api.types";
import { TGetSignedURL } from "@/types/upload";
import { s3 } from "@/lib/s3";
import { GetSignedURLSchema } from "@/types/upload";
import { ErrorHandler } from "@/lib/error";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prisma from "@repo/db/client";
import { decrypt } from "@/lib/encryption";

export const getSignedURL = withServerActionAsyncCatcher<
  TGetSignedURL,
  ServerActionReturnType<{ url: string; thumbnailUrl: string }>
>(async (args) => {
  const validatedData = GetSignedURLSchema.safeParse(args);

  if (!validatedData.success) {
    throw new ErrorHandler("Data validation failed", "BAD_REQUEST");
  }
  const { fileName, directory, fileSize, fileType, checksum } =
    validatedData.data;

  const decryptedAlbumId = Number(decrypt(directory));

  const albumContent = await prisma.albumContents.groupBy({
    by: ["albumId"],
    where: {
      albumId: decryptedAlbumId,
    },
    _sum: {
      fileSize: true,
    },
  });

  const totalFileSize = albumContent[0]?._sum?.fileSize ?? 0;

  if (totalFileSize + fileSize > 1000000000) {
    throw new ErrorHandler(
      "1GB size limit exceeded",
      "INSUFFICIENT_PERMISSIONS"
    );
  }

  const command = new PutObjectCommand({
    Bucket: "test",
    Key: `${directory}/${fileName}`,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
  });

  const thumbnailCommand = new PutObjectCommand({
    Bucket: "test",
    Key: `${directory}/thumbnail-${fileName}`,
  });

  const signedURL = await getSignedUrl(s3, command, {
    expiresIn: 60,
  });
  const thumbnailSignedURL = await getSignedUrl(s3, thumbnailCommand, {
    expiresIn: 60,
  });

  await prisma.albumContents.create({
    data: {
      fileType: fileType.startsWith("image") ? "image" : "video",
      fileSize,
      fileName,
      url: signedURL.split("?")[0]!,
      albumId: decryptedAlbumId,
    },
  });

  return new SuccessResponse("Album exists", 201, {
    url: signedURL,
    thumbnailUrl: thumbnailSignedURL,
  }).serialize();
});
