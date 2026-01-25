"use client";
import { useState } from "react";
import { HardDriveUpload, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/image-upload";
import { acceptedFileType } from "@repo/utils";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useFileInput } from "@/contexts/file-input-context";

type Files = {
  isUploaded: boolean;
  isError: boolean;
  file: File;
  error?: string;
  preview: string;
  fileType: "VIDEO" | "IMAGE"
};

export const FileInput = () => {
  const { files, isUploading, uploadedCount, addFiles, removeFile, clearFiles } = useFileInput();
  const [showDialog, setShowDialog] = useState(false);
  const [isDragging, setIsDragging] = useState(false)

  const errorCount = files.filter(file => file.isError).length

  const toggleDragging = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(prev => !prev)
  }

  return (
    <Dialog open={showDialog} onOpenChange={val => {
      setShowDialog(val);
      clearFiles();
    }}>
      <Button onClick={() => setShowDialog(true)}>
        <Upload size={20} strokeWidth={2.5} />
        Upload Media
      </Button>

      <DialogContent className="max-w-4xl w-[95vw] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            Upload to cloud
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {files.length > 0 && (
            <p className="text-sm text-muted mt-1">
              {uploadedCount} of {files.length} uploaded
              {errorCount > 0 && ` • ${errorCount} failed`}
            </p>
          )}
        </DialogDescription>
        <div>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg transition-all",
              isDragging
                ? "border-accent-foreground bg-muted scale-[0.98]"
                : "border-muted-background hover:border-accent-foreground/50"
            )}
            onDrop={(e) => {
              e.preventDefault()
              addFiles(e.dataTransfer.files)
            }}
            onDragOver={toggleDragging}
            onDragLeave={toggleDragging}
          >
            <label
              htmlFor="dropzone-file"
              className={cn(
                "flex flex-col items-center justify-center py-12 px-6 cursor-pointer transition-colors",
              )}
            >
              <HardDriveUpload
                size={48}
                className={cn(
                  "mb-4 transition-colors",
                )}
                strokeWidth={1.5}
              />

              <div className="text-center">
                <p className="text-foreground mb-2">
                  <span className="font-semibold">Click to upload</span> or drag and
                  drop
                </p>
                <p className="text-sm text-muted">
                  Photos and videos up to 100MB
                </p>
              </div>
              {/* )} */}

              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept={acceptedFileType.join(", ")}
                multiple
                onChange={(e) => e.target.files && addFiles(e.target.files)}
              />
            </label>
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-scroll space-y-2">
          {files.map((file, index) => (
            <ImageUpload
              key={`${file.file.name}-${index}`}
              name={file.file.name}
              size={file.file.size}
              isUploaded={file.isUploaded}
              progress={file.progress}
              isError={file.isError}
              error={file.error}
              preview={URL.createObjectURL(file.file)}
              fileType={file.fileType}
            />
          ))}
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              if (!isUploading) {
                setShowDialog(false);
                clearFiles()
              }
            }}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};