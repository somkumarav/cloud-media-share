"use server";
import { redirect } from "next/navigation";
import prisma, { Album } from "@repo/db";
import { getDecryptedId, GIGABYTE, s3 } from "@repo/utils";
import { withServerActionAsyncCatcher } from "@/lib/async-catch";
import { ServerActionReturnType } from "@/types/api.types";
import { z } from "zod";
import { SuccessResponse } from "@/lib/success";
import { ErrorHandler } from "@/lib/error";
import {
  ChangeAlbumNameSchema,
  TChangeAlbumNameSchema,
} from "@/types/album.types";
import { revalidatePath } from "next/cache";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const createAlbum = async () => {
  const allAlbums = await prisma.album.findMany();

  const totalSize = allAlbums.reduce((accumulator, album) => {
    return accumulator + BigInt(album.totalSize);
  }, 0n);

  if (totalSize > 12 * Number(GIGABYTE)) {
    redirect("/service-unavailable");
  }

  const data = await prisma.album.create({ data: {} });

  if (data.id) {
    redirect(`/album/${data.encryptedToken}`);
  } else {
    throw new Error("Failed to create album");
  }
};

export const changeAlbumName = withServerActionAsyncCatcher<
  TChangeAlbumNameSchema,
  ServerActionReturnType<Album>
>(async (args) => {
  const validatedData = await ChangeAlbumNameSchema.safeParse(args);
  if (!validatedData.success) {
    throw new ErrorHandler("Data validation failed", "BAD_REQUEST");
  }
  const decryptedId = getDecryptedId(validatedData.data.encryptedToken);

  const data = await prisma.album.update({
    where: {
      id: Number(decryptedId),
    },
    data: {
      title: validatedData.data.name,
    },
  });

  revalidatePath("/album/[id]", "page");
  return new SuccessResponse("Album exists", 201, data).serialize();
});

const checkIfAlbumExistsSchema = z.string();
export const checkIfAlbumExists = withServerActionAsyncCatcher<
  string,
  ServerActionReturnType<Album & { albumSize: bigint }>
>(async (args) => {
  const validatedData = await checkIfAlbumExistsSchema.safeParse(args);
  if (!validatedData.success) {
    throw new ErrorHandler("Data validation failed", "BAD_REQUEST");
  }
  const decryptedData = getDecryptedId(validatedData.data);

  const data = await prisma.album.findFirst({
    where: {
      id: Number(decryptedData),
    },
    include: {
      media: true,
    },
  });

  const albumSize =
    data?.media.reduce((accumulator, item) => {
      return accumulator + item.fileSize;
    }, 0n) ?? 0n;

  if (!data) {
    throw new ErrorHandler("Invalid album", "BAD_REQUEST");
  }
  return new SuccessResponse("Album exists", 201, {
    ...{ ...data, albumSize: albumSize },
  }).serialize();
});

export async function getAllImagesFromAlbum(encryptedToken: string) {
  const decryptedAlbumId = getDecryptedId(encryptedToken);
  const albumContent = await prisma.media.findMany({
    where: {
      albumId: decryptedAlbumId,
    },
  });

  try {
    const imageURLs = await Promise.all(
      albumContent.map(async (obj) => {
        const isVideo = obj.type == "VIDEO"
        const imageBucketKey = `${encryptedToken}/${obj.originalName}`;
        const thumbnailBucketKey = `${encryptedToken}/thumbnail-${obj.originalName}`;

        const getObjectCommand = new GetObjectCommand({
          Bucket: "test",
          Key: imageBucketKey,
        });
        const imageURL = await getSignedUrl(s3, getObjectCommand, {
          expiresIn: 36000,
        });

        if (!isVideo) {
          const getThumbnailObjectCommand = new GetObjectCommand({
            Bucket: "test",
            Key: thumbnailBucketKey,
          });
          const thumbnailURL = await getSignedUrl(s3, getThumbnailObjectCommand, {
            expiresIn: 36000,
          });
          return { ...obj, imageURL, thumbnailURL };
        }

        return { ...obj, imageURL, thumbnailURL: null };
      })
    );

    return imageURLs;
  } catch (error) {
    console.error("Error listing objects in R2:", error);
    throw error;
  }
}

