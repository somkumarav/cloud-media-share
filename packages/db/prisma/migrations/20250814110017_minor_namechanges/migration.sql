/*
  Warnings:

  - You are about to drop the `Album` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AlbumContents` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "public"."ProcessingStatus" AS ENUM ('UPLOADING', 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."VariantType" AS ENUM ('THUMBNAIL', 'SMALL', 'MEDIUM', 'LARGE', 'ORIGINAL', 'VIDEO_480P', 'VIDEO_720P', 'VIDEO_1080P');

-- CreateEnum
CREATE TYPE "public"."DownloadType" AS ENUM ('SINGLE', 'BULK_ZIP');

-- CreateEnum
CREATE TYPE "public"."AnalyticsEvent" AS ENUM ('ALBUM_VIEW', 'MEDIA_VIEW', 'ALBUM_SHARE', 'MEDIA_DOWNLOAD', 'ALBUM_DOWNLOAD');

-- DropForeignKey
ALTER TABLE "public"."AlbumContents" DROP CONSTRAINT "AlbumContents_albumId_fkey";

-- DropTable
DROP TABLE "public"."Album";

-- DropTable
DROP TABLE "public"."AlbumContents";

-- CreateTable
CREATE TABLE "public"."albums" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Enter your album name here',
    "description" TEXT,
    "encryptedToken" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "mediaCount" INTEGER NOT NULL DEFAULT 0,
    "allowDownload" BOOLEAN NOT NULL DEFAULT true,
    "totalSize" BIGINT NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mediaId" INTEGER,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media" (
    "id" SERIAL NOT NULL,
    "originalName" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" BIGINT NOT NULL,
    "type" "public"."MediaType" NOT NULL,
    "bucketKey" TEXT NOT NULL,
    "bucketName" TEXT NOT NULL DEFAULT 'main',
    "originalUrl" TEXT,
    "status" "public"."ProcessingStatus" NOT NULL DEFAULT 'UPLOADING',
    "width" INTEGER,
    "height" INTEGER,
    "aspectRatio" DOUBLE PRECISION,
    "metadata" JSONB,
    "albumId" INTEGER NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media_variants" (
    "id" SERIAL NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "type" "public"."VariantType" NOT NULL,
    "format" TEXT NOT NULL,
    "quality" TEXT,
    "filename" TEXT NOT NULL,
    "bucketKey" TEXT NOT NULL,
    "fileSize" BIGINT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "isReady" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."downloads" (
    "id" SERIAL NOT NULL,
    "mediaId" INTEGER,
    "albumId" TEXT,
    "userAgent" TEXT,
    "downloadType" "public"."DownloadType" NOT NULL,
    "fileSize" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "downloads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."analytics" (
    "id" SERIAL NOT NULL,
    "event" "public"."AnalyticsEvent" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "albums_encryptedToken_key" ON "public"."albums"("encryptedToken");

-- CreateIndex
CREATE UNIQUE INDEX "media_bucketKey_key" ON "public"."media"("bucketKey");

-- CreateIndex
CREATE UNIQUE INDEX "media_variants_bucketKey_key" ON "public"."media_variants"("bucketKey");

-- CreateIndex
CREATE UNIQUE INDEX "media_variants_mediaId_type_key" ON "public"."media_variants"("mediaId", "type");

-- CreateIndex
CREATE INDEX "analytics_entityType_entityId_idx" ON "public"."analytics"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "analytics_event_createdAt_idx" ON "public"."analytics"("event", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."albums" ADD CONSTRAINT "albums_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."media" ADD CONSTRAINT "media_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "public"."albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."media_variants" ADD CONSTRAINT "media_variants_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."downloads" ADD CONSTRAINT "downloads_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
