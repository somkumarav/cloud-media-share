"use client";
import { useEffect, useState } from "react";
import { HardDriveUpload, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/image-upload";
import { acceptedFileType } from "@repo/utils";
import { useUploadContext } from "@/contexts/upload-context";
import { DialogDescription } from "@radix-ui/react-dialog";

type Files = {
  isUploaded: boolean;
  isError: boolean;
  file: File;
  error?: string;
  preview: string;
  fileType: "VIDEO" | "IMAGE"
};

export const FileInput = () => {
  const { uploadFile } = useUploadContext();
  const [files, setFiles] = useState<Files[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const noInput = files.length === 0;
  const uploadedCount = files.filter((f) => f.isUploaded).length;
  const errorCount = files.filter((f) => f.isError).length;

  useEffect(() => {
    if (!warning) return;
    const timer = setTimeout(() => setWarning(null), 2000);
    return () => clearTimeout(timer);
  }, [warning]);

  const handleUpload = async (file: File) => {
    try {
      await uploadFile(file);

      setFiles((prev) =>
        prev.map((item) =>
          item.file === file
            ? {
              file: item.file,
              isUploaded: true,
              isError: item.isError,
              fileType: item.fileType,
              preview: item.preview
            }
            : item
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        setFiles((prev) =>
          prev.map((item) =>
            item.file === file
              ? {
                file: item.file,
                isUploaded: item.isUploaded,
                isError: true,
                error: error.message,
                fileType: item.fileType,
                preview: item.preview
              }
              : item
          )
        );
      }
    }
  };

  const uploadFiles = async (filesToUpload: Files[]) => {
    if (filesToUpload.length === 0) return;

    setIsUploading(true);

    await Promise.allSettled(
      filesToUpload.map((fileState) => handleUpload(fileState.file))
    );

    setIsUploading(false);
  };

  const handleFileChange = (fileList: FileList | null) => {
    if (!fileList) return;

    const validFiles = validateFiles(fileList);
    const uniqueFiles = getUniqueFiles(validFiles);

    if (uniqueFiles.length === 0) {
      if (validFiles.length === 0) return;
      setWarning("These files are already in the upload queue");
      return;
    }

    const newFileStates: Files[] = uniqueFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isUploaded: false,
      isError: false,
      fileType: file.type.startsWith("video") ? "VIDEO" : "IMAGE"
    }));

    setFiles((prev) => [...prev, ...newFileStates]);
    uploadFiles(newFileStates);
  };

  const validateFiles = (fileList: FileList): File[] => {
    return Array.from(fileList).filter((file) => {
      if (!acceptedFileType.includes(file.type)) {
        setWarning("Some files were skipped due to invalid file type");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setWarning("Some files exceed the 100MB size limit");
        return false;
      }
      return true;
    });
  };

  const getUniqueFiles = (newFiles: File[]): File[] => {
    return newFiles.filter(
      (newFile) =>
        !files.some(
          (existing) =>
            existing.file.name === newFile.name &&
            existing.file.size === newFile.size
        )
    );
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const fileList = e.dataTransfer.files;
    if (fileList) handleFileChange(fileList);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
              "border-2 border-dashed border-muted rounded-lg transition-all",
              isDragging
                ? "border-accent-foreground bg-muted scale-[0.98]"
                : warning
                  ? "border-destructive bg-destructive-background"
                  : "border-muted-background/50 hover:border-accent-foreground/50"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <label
              htmlFor="dropzone-file"
              className={cn(
                "flex flex-col items-center justify-center py-12 px-6 cursor-pointer transition-colors",
                noInput ? "min-h-[300px]" : "min-h-[180px]"
              )}
            >
              <HardDriveUpload
                size={48}
                className={cn(
                  "mb-4 transition-colors",
                  warning
                    ? "text-destructive"
                    : isDragging
                      ? "text-accent-foreground"
                      : "text-muted"
                )}
                strokeWidth={1.5}
              />

              {warning ? (
                <div className="text-center">
                  <p className="text-destructive font-medium mb-2">{warning}</p>
                  <p className="text-sm text-muted">Try uploading different files</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-foreground mb-2">
                    <span className="font-semibold">Click to upload</span> or drag and
                    drop
                  </p>
                  <p className="text-sm text-muted">
                    Photos and videos up to 100MB
                  </p>
                </div>
              )}

              <input
                multiple
                onChange={(e) => handleFileChange(e.target.files)}
                accept={acceptedFileType.join(", ")}
                id="dropzone-file"
                type="file"
                className="hidden"
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
                setTimeout(() => setFiles([]), 300);
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