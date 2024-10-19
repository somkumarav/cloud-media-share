"use server";
import { redirect } from "next/navigation";
import prisma from "../../lib/prisma";

export const createAlbum = async () => {
  const data = await prisma.album.create({
    data: {
      title: "",
    },
  });

  if (data.id) {
    redirect(`/album/${data.id}`);
  } else {
    throw new Error("Failed to create album");
  }
};
