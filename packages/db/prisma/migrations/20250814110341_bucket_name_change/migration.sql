/*
  Warnings:

  - You are about to drop the column `bucketKey` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `bucketName` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `bucketKey` on the `media_variants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[storageBucketKey]` on the table `media` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storageBucketKey]` on the table `media_variants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `storageBucketKey` to the `media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageBucketKey` to the `media_variants` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."media_bucketKey_key";

-- DropIndex
DROP INDEX "public"."media_variants_bucketKey_key";

-- AlterTable
ALTER TABLE "public"."media" DROP COLUMN "bucketKey",
DROP COLUMN "bucketName",
ADD COLUMN     "storageBucketKey" TEXT NOT NULL,
ADD COLUMN     "storageBucketName" TEXT NOT NULL DEFAULT 'main';

-- AlterTable
ALTER TABLE "public"."media_variants" DROP COLUMN "bucketKey",
ADD COLUMN     "storageBucketKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "media_storageBucketKey_key" ON "public"."media"("storageBucketKey");

-- CreateIndex
CREATE UNIQUE INDEX "media_variants_storageBucketKey_key" ON "public"."media_variants"("storageBucketKey");
