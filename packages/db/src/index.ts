import { PrismaClient } from "@prisma/client";
import { generateEncryptedId } from "@repo/utils";
export * from "@prisma/client";

const prismaClientSingleton = () => {
  const base = new PrismaClient();

  return base.$extends({
    query: {
      album: {
        async create({ args, query }) {
          const result = await query(args);
          const encryptedToken = generateEncryptedId(result.id as number);

          const updated = await base.album.update({
            where: { id: result.id },
            data: { encryptedToken },
          });
          return updated;
        },
      },
      media: {
        async create({ args, query }) {
          const result = await query(args);

          await base.album.update({
            where: { id: result.albumId },
            data: {
              totalSize: { increment: result.fileSize },
              mediaCount: { increment: 1 },
            },
          });

          return result;
        },

        async delete({ args, query }) {
          const result = await query(args);

          await base.album.update({
            where: { id: result.albumId },
            data: {
              totalSize: { decrement: result.fileSize },
              mediaCount: { decrement: 1 },
            },
          });

          return result;
        },

        async update({ args, query }) {
          const result = await query(args);

          if (result.status === "FAILED") {
            await base.album.update({
              where: { id: result.albumId },
              data: {
                totalSize: { decrement: result.fileSize },
                mediaCount: { decrement: 1 },
              },
            });
          }
          return result;
        },
      },
    },
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = prismaClientSingleton();
export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
