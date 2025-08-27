import { PrismaClient } from "@prisma/client";
export * from "@prisma/client";

const prismaClientSingleton = () => {
  const base = new PrismaClient();

  return base.$extends({
    query: {
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
