"use client";
import { DownloadCloudIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <Button
      onClick={(e) => handleDownload(e, props.image)}
      className='p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#2a452a]'
      aria-label='Download image'
    >
      <DownloadCloudIcon className='w-6 h-6' />
    </Button>
  );
};
