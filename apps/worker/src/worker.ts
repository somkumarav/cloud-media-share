import "dotenv/config";
import prisma, { VariantType } from "@repo/db";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { s3 } from "@repo/utils";
import { redis } from "@repo/queue";

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
            variants: true,
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
            status: "COMPLETED",
            processedAt: new Date(),
            height: metadata?.height,
            width: metadata?.width,
            aspectRatio: metadata.width / metadata.height,
            variants: {
              update: {
                where: {
                  id: mediaData?.variants[0]?.id,
                  type: VariantType.ORIGINAL,
                },
                data: {
                  height: metadata.height,
                  width: metadata.width,
                  isReady: true,
                },
              },
              create: [
                {
                  filename: `thumbnail-${mediaData?.filename}`,
                  fileSize: BigInt(thumbnailImage.length),
                  mimeType: "image/webp",
                  format: "webp",
                  storageBucketKey: `${mediaData?.album.encryptedToken}/thumbnail-${mediaData?.filename}`,
                  type: VariantType.THUMBNAIL,
                  height: 550,
                  width: 550,
                  isReady: true,
                },
                {
                  filename: `small-${mediaData?.filename}`,
                  fileSize: BigInt(smallImage.length),
                  mimeType: "image/webp",
                  format: "webp",
                  storageBucketKey: `${mediaData?.album.encryptedToken}/small-${mediaData?.filename}`,
                  type: VariantType.SMALL,
                  height: 600,
                  width: 600,
                  isReady: true,
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
