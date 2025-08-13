import { listImagesInDirectory } from "@/actions/r2.actions";
import { EmptyGallery } from "@/components/empty-gallery";
import { IndividualImage } from "./individual-image";

export const ImageGallery = async ({ directory }: { directory: string }) => {
  const imageUrls = await listImagesInDirectory(directory);

  // if (isLoading) return <div className='text-center'>Loading...</div>;
  if (!imageUrls.length) return <EmptyGallery directory={directory} />;
  // if (error) return <div className='text-center text-red-500'>{error}</div>;

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
      {imageUrls.map((image) => (
        <IndividualImage
          key={image.id}
          {...{
            albumId: image.albumId,
            createdAt: image.createdAt,
            fileName: image.filename,
            fileSize: image.fileSize,
            fileType: image.type,
            id: image.id,
            imageURL: image.imageURL,
            thumbnailURL: image.thumbnailURL,
          }}
        />
      ))}
    </div>
  );
};
