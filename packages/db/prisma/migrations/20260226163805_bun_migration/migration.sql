-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "ProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "VariantType" AS ENUM ('THUMBNAIL', 'SMALL', 'MEDIUM', 'LARGE', 'ORIGINAL', 'VIDEO_480P', 'VIDEO_720P', 'VIDEO_1080P');

-- CreateEnum
CREATE TYPE "DownloadType" AS ENUM ('SINGLE', 'BULK_ZIP');

-- CreateEnum
CREATE TYPE "AnalyticsEvent" AS ENUM ('ALBUM_VIEW', 'MEDIA_VIEW', 'ALBUM_SHARE', 'MEDIA_DOWNLOAD', 'ALBUM_DOWNLOAD');

-- CreateTable
CREATE TABLE "albums" (
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

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "originalName" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" BIGINT NOT NULL,
    "type" "MediaType" NOT NULL,
    "storageBucketKey" TEXT NOT NULL,
    "storageBucketName" TEXT NOT NULL DEFAULT 'main',
    "originalUrl" TEXT,
    "status" "ProcessingStatus" NOT NULL DEFAULT 'PENDING',
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
CREATE TABLE "media_variants" (
    "id" SERIAL NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "type" "VariantType" NOT NULL,
    "format" TEXT NOT NULL,
    "quality" TEXT,
    "filename" TEXT NOT NULL,
    "storageBucketKey" TEXT NOT NULL,
    "fileSize" BIGINT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "isReady" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "downloads" (
    "id" SERIAL NOT NULL,
    "mediaId" INTEGER,
    "albumId" INTEGER,
    "userAgent" TEXT,
    "downloadType" "DownloadType" NOT NULL,
    "fileSize" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "downloads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics" (
    "id" SERIAL NOT NULL,
    "event" "AnalyticsEvent" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "albums_encryptedToken_key" ON "albums"("encryptedToken");

-- CreateIndex
CREATE UNIQUE INDEX "media_storageBucketKey_key" ON "media"("storageBucketKey");

-- CreateIndex
CREATE UNIQUE INDEX "media_variants_storageBucketKey_key" ON "media_variants"("storageBucketKey");

-- CreateIndex
CREATE UNIQUE INDEX "media_variants_mediaId_type_key" ON "media_variants"("mediaId", "type");

-- CreateIndex
CREATE INDEX "analytics_entityType_entityId_idx" ON "analytics"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "analytics_event_createdAt_idx" ON "analytics"("event", "createdAt");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_variants" ADD CONSTRAINT "media_variants_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
