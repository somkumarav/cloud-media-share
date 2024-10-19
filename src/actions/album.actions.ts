"use server";
import { redirect } from "next/navigation";
import prisma from "../../lib/prisma";
import { decrypt, encrypt } from "../../lib/encryption";
import { withServerActionAsyncCatcher } from "../../lib/async-catch";
import { ServerActionReturnType } from "../../types/api.types";
import { z } from "zod";
import { SuccessResponse } from "../../lib/success";
import { ErrorHandler } from "../../lib/error";

export const createAlbum = async () => {
  const data = await prisma.album.create({
    data: {
      title: "",
    },
  });

  const encryptedData = encrypt(`${data.id}`);
  console.log("enc", encryptedData);

  if (data.id) {
    redirect(`/album/${encryptedData}`);
  } else {
    throw new Error("Failed to create album");
  }
};

const checkIfAlbumExistsSchema = z.string();
export const checkIfAlbumExists = withServerActionAsyncCatcher<
  string,
  ServerActionReturnType<unknown>
>(async (args) => {
  const validatedData = await checkIfAlbumExistsSchema.safeParse(args);
  if (!validatedData.success) {
    throw new ErrorHandler("Data validation failed", "BAD_REQUEST");
  }
  const decryptedData = decrypt(validatedData.data);
  console.log("dec", decryptedData);

  const data = await prisma.album.findFirst({
    where: {
      id: Number(decryptedData),
    },
  });
  if (!data) {
    throw new ErrorHandler("Invalid album", "BAD_REQUEST");
  }
  return new SuccessResponse("Album exists", 201).serialize();
});
