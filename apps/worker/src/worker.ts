import "dotenv/config";
import prisma, { VariantType } from "@repo/db";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { S3Client } from "@aws-sdk/client-s3";
import { redis } from "@repo/queue";

export const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESSID as string,
    secretAccessKey: process.env.CLOUDFLARE_ACCESSSECRET as string,
  },
});

async function streamToBuffer(stream: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

async function pullAndLogJobs() {
  while (true) {
    try {
      const result = await redis.brpop("media-processing", 5);
      if (result) {
        const [queueName, jobData] = result;

        const mediaData = await prisma.media.findUnique({
          where: {
            id: Number(JSON.parse(jobData).data.mediaId),
          },
          include: {
            album: true,
          },
        });

        const getImageFromBucket = new GetObjectCommand({
          Bucket: "test",
          Key: mediaData?.storageBucketKey,
        });

        const { Body } = await s3.send(getImageFromBucket);
        const imageBuffer = await streamToBuffer(Body);
        console.log({ Body, imageBuffer });

        const image = await sharp(imageBuffer);
        const metadata = await image.metadata();
        const stats = await image.stats();

        const thumbnail = await image.webp({ quality: 70 }).toBuffer();

        const thumbnailCommand = new PutObjectCommand({
          Bucket: "test",
          Key: `${mediaData?.album.encryptedToken}/thumbnail-${mediaData?.filename}`,
          ContentType: mediaData?.mimeType,
          Body: thumbnail,
        });

        await s3.send(thumbnailCommand);

        await prisma.media.update({
          where: { id: mediaData!.id },
          data: {
            variants: {
              create: [
                {
                  filename: `thumbnail-${mediaData?.filename}`,
                  fileSize: BigInt(thumbnail.length),
                  mimeType: "image/webp",
                  format: "webp",
                  storageBucketKey: `${mediaData?.album.encryptedToken}/thumbnail-${mediaData?.filename}`,
                  type: "THUMBNAIL",
                },
              ],
            },
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

async function main() {
  await pullAndLogJobs();
}

main().catch(console.error);
