"use client";
import { EmptyGallery } from "@/components/empty-gallery";
import { IndividualImage } from "./individual-image";
import { useUploadContext } from "@/contexts/upload-context";

export const ImageGallery = () => {
  const { media: allImages, isLoading } = useUploadContext();

  if (isLoading) return <div className='text-center'>Loading...</div>;
  if (!allImages.length) return <EmptyGallery />;

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
      {allImages.map((image) => (
        <IndividualImage
          key={image.id}
          {...{
            createdAt: image.createdAt,
            fileName: image.fileName,
            fileSize: image.fileSize,
            fileType: image.fileType,
            id: image.id,
            imageURL: image.imageURL,
            thumbnailURL: image.thumbnailURL ?? image.imageURL,
            isLocal: image.isLocal,
          }}
        />
      ))}
    </div>
  );
};
