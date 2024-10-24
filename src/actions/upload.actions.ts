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

export const getSignedURL = withServerActionAsyncCatcher<
  TGetSignedURL,
  ServerActionReturnType<{ url: string }>
>(async (args) => {
  const validatedData = GetSignedURLSchema.safeParse(args);

  if (!validatedData.success) {
    throw new ErrorHandler("Data validation failed", "BAD_REQUEST");
  }

  const { fileName, directory } = validatedData.data;

  const command = new PutObjectCommand({
    Bucket: "test",
    Key: `${directory}/${fileName}`,
  });

  const signedURL = await getSignedUrl(s3, command, {
    expiresIn: 60,
  });

  return new SuccessResponse("Album exists", 201, {
    url: signedURL,
  }).serialize();
});
