"use client";
import { DownloadCloudIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadImage } from "@/actions/download.actions";

export const DownloadImageButton = (props: {
  imageId: number;
  isLocal?: boolean;
  imageURL?: string;
}) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const handleFileDownload = async (imageURL: string) => {
      try {
        const response = await fetch(imageURL);
        const blob = await response.blob();
        const blobURL = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobURL;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobURL);
      } catch (error) {
        console.error("Error downloading local image:", error);
      }
    };

    if (props.isLocal && props.imageURL) {
      handleFileDownload(props.imageURL);
      return;
    }

    const signedURL = await downloadImage(props.imageId);
    handleFileDownload(signedURL);
  };

  return (
    <Button
      onClick={(e) => handleDownload(e)}
      className='p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#2a452a]'
      aria-label='Download image'
    >
      <DownloadCloudIcon className='w-6 h-6' />
    </Button>
  );
};
