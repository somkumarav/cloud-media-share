import { generateEncryptedId } from "@repo/utils";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prismaClientSingleton = () => {
  const base = new PrismaClient({
    adapter,
  });

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

const globalForPrisma = global as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton>;
};

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
