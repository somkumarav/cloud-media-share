import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESSID as string,
    secretAccessKey: process.env.CLOUDFLARE_ACCESSSECRET as string,
  },
});
