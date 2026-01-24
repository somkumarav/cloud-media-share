"use client";
import { useEffect, useState } from "react";
import { HardDriveUpload, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ImageUpload from "@/components/image-upload";
import { acceptedFileType } from "@repo/utils";
import { useUploadContext } from "@/contexts/upload-context";

type Files = {
  isUploaded: boolean;
  isError: boolean;
  file: File;
  error?: string;
};

export const FileInput = () => {
  const { uploadFile } = useUploadContext();
  const [files, setFiles] = useState<Files[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const noInput = files.length <= 0;

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

    if (uniqueFiles.length === 0) return;

    const newFileStates: Files[] = uniqueFiles.map((file) => ({
      file,
      isUploaded: false,
      isError: false,
    }));

    setFiles((prev) => [...prev, ...newFileStates]);
    uploadFiles(newFileStates);
  };

  const validateFiles = (fileList: FileList): File[] => {
    return Array.from(fileList).filter((file) => {
      if (!acceptedFileType.includes(file.type)) {
        setWarning("Invalid file type");
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

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <Button
        onClick={() => {
          setShowDialog(true);
        }}
      >
        <Upload strokeWidth={3} />
        Upload photos
      </Button>
      <DialogContent className='max-w-[1000px] flex flex-col items-center'>
        <DialogTitle className='text-2xl pt-2'>Upload to cloud ☁️</DialogTitle>
        <form
          onSubmit={(e) => e.preventDefault()}
          className='flex flex-col h-full items-center min-w-[66%] justify-start border-2 border-dashed rounded-lg'
        >
          <div
            className='flex w-full '
            onDrop={(e) => {
              e.preventDefault();
              const fileList = e.dataTransfer.files;
              if (fileList) handleFileChange(fileList);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <label
              htmlFor='dropzone-file'
              className={cn(
                "relative min-h-[250px] w-full flex items-center justify-center rounded-lg  transition-all cursor-pointer",
                warning
                  ? "bg-destructive/20"
                  : "bg-accent-background hover:bg-accent-foreground/20",
                { "border-b rounded-b-none": !noInput }
              )}
            >
              <div className='flex flex-col items-center'>
                <HardDriveUpload
                  size={50}
                  className={cn(
                    "mb-4",
                    warning ? "text-destructive" : "text-accent-foreground"
                  )}
                />
                <p
                  className={cn(
                    "mb-2 text-sm text-gray-500",
                    warning ? "text-destructive" : "text-accent-foreground"
                  )}
                >
                  {warning ? (
                    <p className='text-xl'>{warning}</p>
                  ) : (
                    <>
                      <span className='font-semibold'>Click to upload</span> or
                      drag and drop
                    </>
                  )}
                </p>

                <input
                  multiple
                  onChange={(e) => {
                    const fileList = e.target.files;
                    if (fileList) handleFileChange(fileList);
                  }}
                  accept={acceptedFileType.join(', ')}
                  id='dropzone-file'
                  type='file'
                  className='hidden'
                />
              </div>
            </label>
          </div>
          {noInput ? null : (
            <div className='flex flex-col w-full'>
              <div className='max-h-[250px] max-w-[650px] overflow-y-auto no-scrollbar'>
                <table className='min-w-full divide-y'>
                  <thead className='bg-muted-background sticky top-0 z-10'>
                    <tr>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
                      >
                        Preview
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
                      >
                        Name
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
                      >
                        Size
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className='relative divide-y max-h-[250px]'>
                    {files.map((file, index) => (
                      <ImageUpload
                        key={index}
                        isUploaded={file.isUploaded}
                        isError={file.isError}
                        error={file.error}
                        imageURL={URL.createObjectURL(file.file)}
                        name={file.file.name}
                        size={BigInt(file.file.size)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </form>
        <div className='flex w-full justify-end'>
          <Button
            size='lg'
            onClick={() => {
              setShowDialog(false);
              setFiles([]);
            }}
            disabled={isUploading}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
