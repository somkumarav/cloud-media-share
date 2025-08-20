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

        const image = await sharp(imageBuffer);
        const metadata = await image.metadata();
        const stats = await image.stats();

        const thumbnailImage = await image
          .resize({ height: 550, width: 550 })
          .webp()
          .toBuffer();
        const smallImage = await image
          .resize({ height: 600, width: 600 })
          .webp()
          .toBuffer();

        const thumbnailImageCommand = new PutObjectCommand({
          Bucket: "test",
          Key: `${mediaData?.album.encryptedToken}/thumbnail-${mediaData?.filename}`,
          ContentType: mediaData?.mimeType,
          Body: thumbnailImage,
        });
        const smallImageCommand = new PutObjectCommand({
          Bucket: "test",
          Key: `${mediaData?.album.encryptedToken}/small-${mediaData?.filename}`,
          ContentType: mediaData?.mimeType,
          Body: smallImage,
        });

        await s3.send(thumbnailImageCommand);
        await s3.send(smallImageCommand);

        await prisma.media.update({
          where: { id: mediaData!.id },
          data: {
            variants: {
              create: [
                {
                  filename: `thumbnail-${mediaData?.filename}`,
                  fileSize: BigInt(thumbnailImage.length),
                  mimeType: "image/webp",
                  format: "webp",
                  storageBucketKey: `${mediaData?.album.encryptedToken}/thumbnail-${mediaData?.filename}`,
                  type: VariantType.THUMBNAIL,
                },
                {
                  filename: `small-${mediaData?.filename}`,
                  fileSize: BigInt(smallImage.length),
                  mimeType: "image/webp",
                  format: "webp",
                  storageBucketKey: `${mediaData?.album.encryptedToken}/small-${mediaData?.filename}`,
                  type: VariantType.SMALL,
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
