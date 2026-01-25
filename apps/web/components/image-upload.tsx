"use client"

import Image from "next/image";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { useEffect } from "react";
import { UploadProgressBar } from "@/components/ui/upload-progress-bar";

export const ImageUpload = ({
  name,
  size,
  isUploaded,
  preview,
  progress,
  isError,
  error,
  fileType
}: {
  name: string;
  size: number;
  isUploaded: boolean;
  preview: string;
  progress: number;
  isError: boolean;
  error?: string;
  fileType: "VIDEO" | "IMAGE"
}) => {
  useEffect(() => {
    return () => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div>
      <div className="grid grid-cols-10 grid-rows-1 px-4 py-2 h-24 border hover:bg-background-secondary border-muted/30 rounded-md">
        <div className="col-span-7 flex items-center space-x-4">
          {fileType == 'VIDEO' ?
            <video
              src={preview}
              className="h-20 w-20 object-cover rounded-md"
              autoPlay
              controls={false}
              muted
            />
            :
            <Image
              className="h-20 w-20 object-cover rounded-md"
              height={0}
              width={0}
              src={preview}
              alt={name}
            />
          }
          <div>
            <p>{name}</p>
            <p className="text-muted">{formatFileSize(BigInt(size)).formatted}</p>
          </div>
        </div>
        <div className="col-span-3 flex items-center">

          {isError ? (
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle size={18} />
              <span className="text-xs">{error || "Failed"}</span>
            </div>
          ) : isUploaded ? (
            <div className="flex items-center space-x-2 text-accent-foreground">
              <CheckCircle2 size={18} />
              <span className="text-xs">Done</span>
            </div>
          ) : (
            <div className="flex min-w-20 items-center space-x-2 text-muted">
              <UploadProgressBar progressWidth={progress} />
            </div>
          )}
        </div>
      </div>
    </div >
  );
}