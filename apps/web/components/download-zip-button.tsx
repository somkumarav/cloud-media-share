"use client";

import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { downloadAlbumAsZip } from "@/actions/download.actions";
import { Button } from "@/components/ui/button";

export function DownloadAsZipButton({
  encryptedToken,
}: {
  encryptedToken: string;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleBulkDownload = async () => {
    try {
      setIsDownloading(true);
      setProgress(0);

      const { albumName, images } = await downloadAlbumAsZip(encryptedToken);

      const zip = new JSZip();

      for (let index = 0; index < images.length; index++) {
        const { filename, imageURL } = images[index]!;
        const response = await fetch(imageURL);
        const blob = await response.blob();
        zip.file(filename, blob);
        setProgress(Math.round(((index + 1) / images.length) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${albumName}.zip`);
    } catch (error) {
      console.error("Bulk download error:", error);
    } finally {
      setIsDownloading(false);
      setProgress(0);
    }
  };

  return (
    <Button onClick={handleBulkDownload} disabled={isDownloading}>
      {isDownloading ? (
        <div className='flex items-center gap-2'>
          <Loader2 className='w-4 h-4 animate-spin' />
          <span>{progress}%</span>
        </div>
      ) : (
        <>
          <Download className='w-4 h-4' />
          Download All
        </>
      )}
    </Button>
  );
}
