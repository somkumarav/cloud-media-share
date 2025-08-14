"use client";
import { useEffect, useState } from "react";
import { HardDriveUpload, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import ImageUpload from "@/components/image-upload";
import { getSignedURL, uploadCompleted } from "@/actions/upload.actions";
import { useRouter } from "next/navigation";
import { acceptedFileType } from "@repo/utils/index";
import { useUploadContext } from "@/contexts/upload-context";

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export const FileInput = (props: { encryptedToken: string }) => {
  const router = useRouter();
  const { addUploadedImage } = useUploadContext();
  const [files, setFiles] = useState<
    { isUploaded: boolean; isError: boolean; file: File }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const noInput = files.length <= 0;

  useEffect(() => {
    if (warning) {
      setTimeout(() => {
        setWarning(null);
      }, 2000);
    }
  }, [warning]);

  const uploadFile = async (file: File) => {
    const checksum = await computeSHA256(file);
    const getSignedURLAction = await getSignedURL({
      fileName: file.name,
      encryptedToken: props.encryptedToken,
      fileSize: file.size,
      mimeType: file.type,
      checksum: checksum,
    });

    if (!getSignedURLAction.status) {
      setFiles((prev) =>
        prev.map((item) =>
          item.file === file
            ? {
                file: item.file,
                isUploaded: item.isUploaded,
                isError: true,
              }
            : {
                file: item.file,
                isUploaded: item.isUploaded,
                isError: item.isError,
              }
        )
      );
      return;
    }
    if (!getSignedURLAction.data?.signedURL) return;

    const response = await fetch(getSignedURLAction.data?.signedURL, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    uploadCompleted({ mediaId: getSignedURLAction.data.mediaId });

    // Store the uploaded image in context for immediate gallery display
    const imageId = `${props.encryptedToken}-${file.name}-${Date.now()}`;
    const imageUrl = URL.createObjectURL(file);

    addUploadedImage({
      id: imageId,
      fileName: file.name,
      imageUrl,
      fileSize: file.size,
      fileType: file.type,
      encryptedToken: props.encryptedToken, //
      uploadedAt: new Date(),
    });

    setFiles((prev) =>
      prev.map((item) =>
        item.file === file
          ? {
              file: item.file,
              isUploaded: true,
              isError: item.isError,
            }
          : {
              file: item.file,
              isUploaded: item.isUploaded,
              isError: item.isError,
            }
      )
    );

    return response;
  };

  const uploadParallelly = async (
    uniqueFiles: {
      file: File;
      isUploaded: boolean;
    }[],
    concurrencyLimit = 3
  ) => {
    setIsUploading(true);

    const uploadQueue = uniqueFiles.filter((file) => !file.isUploaded);
    const results = [];

    while (uploadQueue.length > 0) {
      const batch = uploadQueue.splice(0, concurrencyLimit);
      const batchPromises = batch.map((file) =>
        uploadFile(file.file)
          .then(() => ({ success: true, file: file.file }))
          .catch((error) => ({ success: false, file: file.file, error }))
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    const failedUploads = results.filter((result) => !result.success);
    if (failedUploads.length > 0) {
      console.error("Some files failed to upload:", failedUploads);
    }

    router.refresh();
    setIsUploading(false);
  };

  const handleFileChange = (fileList: FileList) => {
    if (fileList) {
      const newFiles = Array.from(fileList)
        .filter((file) => {
          if (!acceptedFileType.includes(file.type))
            return setWarning("Invalid file type");
          return file;
        })
        .map((file) => ({
          file,
          isUploaded: false,
        }));

      const uniqueFiles = newFiles.filter(
        (newFile) =>
          !files.some(
            (existingFile) =>
              existingFile.file.name === newFile.file.name &&
              existingFile.file.size === newFile.file.size
          )
      );

      setFiles((prev) => [
        ...prev,
        ...uniqueFiles.map((item) => {
          return { ...item, isuploaded: false, isError: false };
        }),
      ]);

      setIsUploading(true);
      // uploadSequentially(uniqueFiles);
      uploadParallelly(uniqueFiles);
    }
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
        <DialogHeader className='text-2xl'>Upload to cloud ☁️</DialogHeader>
        <form
          onSubmit={(e) => e.preventDefault()}
          className='flex flex-col h-full items-center w-full lg:w-2/3 justify-start border-2 border-dashed rounded-lg'
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
                  accept='image/jpeg, image/jpg, image/png'
                  id='dropzone-file'
                  type='file'
                  className='hidden'
                />
              </div>
            </label>
          </div>
          {noInput ? null : (
            <div className='flex flex-col w-full'>
              <div className='max-h-[250px] overflow-y-auto no-scrollbar'>
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
                        imageURL={URL.createObjectURL(file.file)}
                        name={file.file.name}
                        size={file.file.size}
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
