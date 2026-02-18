"use server";
import { withServerActionAsyncCatcher } from "../lib/async-catch";
import { ErrorHandler } from "../lib/error";
import { ServerActionReturnType } from "../types/api.types";
import { ChangeMediaNameSchema, TChangeMediaName } from "../types/media.types";
import { prisma } from "@repo/db";
import type { Media } from "@repo/db";
import { SuccessResponse } from "@/lib/success";

export const editMediaName = withServerActionAsyncCatcher<
  TChangeMediaName,
  ServerActionReturnType<Media>
>(async (args) => {
  const validatedData = await ChangeMediaNameSchema.safeParse(args);
  if (!validatedData.success) {
    throw new ErrorHandler("Data validation failed", "BAD_REQUEST");
  }

  const data = await prisma.media.update({
    where: {
      id: validatedData.data.mediaId,
    },
    data: {
      filename: validatedData.data.newName,
    },
  });

  if (!data) throw new ErrorHandler("Media does not exists", "BAD_REQUEST");

  // revalidatePath("/album/[id]", "page");
  return new SuccessResponse("Name changed", 200, data).serialize();
});
