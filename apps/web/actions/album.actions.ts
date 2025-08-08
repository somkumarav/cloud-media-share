"use server";
import { redirect } from "next/navigation";
import prisma from "@repo/db/client";
import { decrypt, encrypt } from "@/lib/encryption";
import { withServerActionAsyncCatcher } from "@/lib/async-catch";
import { ServerActionReturnType } from "@/types/api.types";
import { z } from "zod";
import { SuccessResponse } from "@/lib/success";
import { ErrorHandler } from "@/lib/error";
import { Album } from "@repo/db/client";
import { ChangeAlbumNameSchema, TChangeAlbumNameSchema } from "@/types/album";
import { revalidatePath } from "next/cache";

export const createAlbum = async () => {
  const albumContentSum = await prisma.albumContents.groupBy({
    by: ["albumId"],
    _sum: {
      fileSize: true,
    },
  });
  const totalSize = albumContentSum.reduce((total, item) => {
    return item._sum.fileSize ? total + item._sum.fileSize : total;
  }, 0);

  if (totalSize > 12000000000) {
    redirect("/service-unavailable");
  }

  const data = await prisma.album.create({
    data: {
      title: "",
    },
  });

  const encryptedData = encrypt(`${data.id}`);

  if (data.id) {
    redirect(`/album/${encryptedData}`);
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
  const decryptedId = decrypt(validatedData.data.albumId);

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
  ServerActionReturnType<Album>
>(async (args) => {
  console.log("Checking if album exists with args:", args);
  const validatedData = await checkIfAlbumExistsSchema.safeParse(args);
  if (!validatedData.success) {
    throw new ErrorHandler("Data validation failed", "BAD_REQUEST");
  }
  const decryptedData = decrypt(validatedData.data);

  const data = await prisma.album.findFirst({
    where: {
      id: Number(decryptedData),
    },
  });
  console.log({ data });
  if (!data) {
    throw new ErrorHandler("Invalid album", "BAD_REQUEST");
  }
  return new SuccessResponse("Album exists", 201, data).serialize();
});
