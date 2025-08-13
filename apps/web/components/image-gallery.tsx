"use client";
import { useEffect, useState } from "react";
import { listImagesInDirectory } from "@/actions/r2.actions";
import { EmptyGallery } from "@/components/empty-gallery";
import { IndividualImage } from "./individual-image";
import { useUploadContext } from "@/contexts/upload-context";

interface BucketImage {
  id: number;
  albumId: number;
  createdAt: Date;
  fileName: string;
  fileSize: bigint;
  fileType: string;
  imageURL: string;
  thumbnailURL: string;
}

export const ImageGallery = ({ directory }: { directory: string }) => {
  const { getUploadedImagesForAlbum } = useUploadContext();
  const [bucketImages, setBucketImages] = useState<BucketImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBucketImages = async () => {
      try {
        const images = await listImagesInDirectory(directory);
        // Map the bucket images to match our expected structure
        const mappedImages = images.map((image) => ({
          id: image.id,
          albumId: image.albumId,
          createdAt: image.createdAt,
          fileName: image.filename,
          fileSize: image.fileSize,
          fileType: image.type,
          imageURL: image.imageURL,
          thumbnailURL: image.thumbnailURL || image.imageURL, // Fallback to main image if thumbnail is null
        }));
        setBucketImages(mappedImages);
      } catch (error) {
        console.error("Error loading bucket images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBucketImages();
  }, [directory]);

  const localImages = getUploadedImagesForAlbum(directory);

  // Combine local and bucket images, with local images taking precedence
  const allImages = [
    ...bucketImages,
    ...localImages.map((localImage) => ({
      id: parseInt(localImage.id.split("-").pop() || "0"),
      albumId: parseInt(directory),
      createdAt: localImage.uploadedAt,
      fileName: localImage.fileName,
      fileSize: BigInt(localImage.fileSize),
      fileType: localImage.fileType,
      imageURL: localImage.imageUrl,
      thumbnailURL: localImage.thumbnailUrl,
    })),
  ];

  if (isLoading) return <div className='text-center'>Loading...</div>;
  if (!allImages.length) return <EmptyGallery directory={directory} />;

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
      {allImages.map((image) => (
        <IndividualImage
          key={image.id}
          {...{
            albumId: image.albumId,
            createdAt: image.createdAt,
            fileName: image.fileName,
            fileSize: image.fileSize,
            fileType: image.fileType,
            id: image.id,
            imageURL: image.imageURL,
            thumbnailURL: image.thumbnailURL,
          }}
        />
      ))}
    </div>
  );
};
