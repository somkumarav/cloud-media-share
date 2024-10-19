"use client";
import { DownloadCloudIcon } from "lucide-react";

type ImageObject = {
  key: string;
  url: string;
};

export const DownloadImageButton = (props: { image: ImageObject }) => {
  const handleDownload = async (e: React.MouseEvent, image: ImageObject) => {
    e.preventDefault();
    e.stopPropagation();

    const filename = image.key.split("/").pop() || "image";
    const downloadUrl = `/api/download?url=${encodeURIComponent(
      image.url
    )}&filename=${encodeURIComponent(filename)}`;

    window.location.href = downloadUrl;
  };

  return (
    <button
      onClick={(e) => handleDownload(e, props.image)}
      className='p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200'
      aria-label='Download image'
    >
      <DownloadCloudIcon className='w-6 h-6 text-black' />
    </button>
  );
};
