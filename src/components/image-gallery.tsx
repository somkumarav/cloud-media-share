import { listImagesInDirectory } from "@/src/actions/r2.actions";
import Image from "next/image";
import { DownloadImageButton } from "@/src/components/download-image-button";

export const ImageGallery = async ({ directory }: { directory: string }) => {
  const imageUrls = await listImagesInDirectory(directory);

  // if (isLoading) return <div className='text-center'>Loading...</div>;
  // if (!images.length)
  //   return <div className='text-center'>Add images to cloud</div>;
  // if (error) return <div className='text-center text-red-500'>{error}</div>;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {imageUrls.map((image) => (
        <div key={image.key} className='relative aspect-square group'>
          <Image
            src={image.url}
            alt={image.key}
            className='object-cover w-full h-full rounded-lg'
            unoptimized
            height={100}
            width={100}
          />
          <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center'>
            <DownloadImageButton image={image} />
          </div>
          <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text- p-2 text-sm truncate'>
            {image.key.split("/").pop()}
          </div>
        </div>
      ))}
    </div>
  );
};
