"use server";
import { redirect } from "next/navigation";
import prisma, { Album } from "@repo/db";
import { getDecryptedId, generateEncryptedId, GIGABYTE } from "@repo/utils";
import { withServerActionAsyncCatcher } from "@/lib/async-catch";
import { ServerActionReturnType } from "@/types/api.types";
import { z } from "zod";
import { SuccessResponse } from "@/lib/success";
import { ErrorHandler } from "@/lib/error";
import { ChangeAlbumNameSchema, TChangeAlbumNameSchema } from "@/types/album";
import { revalidatePath } from "next/cache";

export const createAlbum = async () => {
  const allAlbums = await prisma.album.findMany();

  const totalSize = allAlbums.reduce((accumulator, album) => {
    return accumulator + BigInt(album.totalSize);
  }, 0n);

  if (totalSize > 12 * Number(GIGABYTE)) {
    redirect("/service-unavailable");
  }

  const encryptedToken = generateEncryptedId(allAlbums.pop()?.id ?? 0 + 1);

  const data = await prisma.album.create({
    data: {
      encryptedToken,
    },
  });

  if (data.id) {
    redirect(`/album/${encryptedToken}`);
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
