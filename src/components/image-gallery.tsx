"use client";
import { useState, useEffect } from "react";
import { listImagesInDirectory } from "@/actions/r2.actions";
import { DownloadCloudIcon } from "lucide-react";
import Image from "next/image";

interface ImageObject {
  key: string;
  url: string;
}

export const ImageGallery = ({
  directory = "som/",
}: {
  directory?: string;
}) => {
  const [images, setImages] = useState<ImageObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const imageUrls = await listImagesInDirectory(directory);
        setImages(imageUrls);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch images");
      } finally {
        setIsLoading(false);
      }
    }

    fetchImages();
  }, [directory]);

  const handleDownload = async (e: React.MouseEvent, image: ImageObject) => {
    e.preventDefault();
    e.stopPropagation();

    const filename = image.key.split("/").pop() || "image";
    const downloadUrl = `/api/download?url=${encodeURIComponent(
      image.url
    )}&filename=${encodeURIComponent(filename)}`;

    window.location.href = downloadUrl;
  };

  if (isLoading) return <div className='text-center'>Loading...</div>;
  if (error) return <div className='text-center text-red-500'>{error}</div>;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {images.map((image) => (
        <div key={image.key} className='relative aspect-square group'>
          <Image
            src={image.url}
            alt={image.key}
            className='object-cover w-full h-full rounded-lg'
            unoptimized
            height={100}
            width={100}
          />
          <div className='absolute inset-0 bg-background bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center'>
            <button
              onClick={(e) => handleDownload(e, image)}
              className='p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200'
              aria-label='Download image'
            >
              <DownloadCloudIcon className='w-6 h-6 text-background' />
            </button>
          </div>
          <div className='absolute bottom-0 left-0 right-0 bg-background bg-opacity-50 text-white p-2 text-sm truncate'>
            {image.key.split("/").pop()}
          </div>
        </div>
      ))}
    </div>
  );
};
