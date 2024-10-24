"use client";
import { ChangeEvent, useState } from "react";
import { HardDriveUpload, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

import { cn } from "@/lib/utils";
import ImageUpload from "@/src/components/image-upload";
import { getSignedURL } from "@/src/actions/upload.actions";

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export const FileInput = (props: { directory: string }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [files, setFiles] = useState<{ isUploaded: boolean; file: File }[]>([]);
  const noInput = files.length <= 0;

  const uploadFile = async (file: File) => {
    const getSignedURLAction = await getSignedURL({
      fileName: file.name,
      directory: props.directory,
      fileSize: file.size,
      fileType: file.type,
      checksum: await computeSHA256(file),
    });

    if (!getSignedURLAction.status) return;
    if (!getSignedURLAction.data?.url) return;
    console.log(getSignedURLAction.data.url);

    const response = await fetch(getSignedURLAction.data?.url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    setFiles((prev) =>
      prev.map((item) =>
        item.file === file
          ? {
              file: item.file,
              isUploaded: true,
            }
          : {
              file: item.file,
              isUploaded: item.isUploaded,
            }
      )
    );

    return response;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
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
          return { ...item, isuploaded: false };
        }),
      ]);

      setIsUploading(true);
      uniqueFiles.map((file) => {
        uploadFile(file.file);
      });
      setIsUploading(false);
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
      <DialogContent className='max-w-[900px] flex flex-col items-center'>
        <DialogHeader className='text-2xl'>Upload to cloud ☁️</DialogHeader>
        <form
          onSubmit={(e) => e.preventDefault()}
          className='flex flex-col h-full items-center w-full lg:w-2/3 justify-start border-2 border-dashed rounded-lg'
        >
          <div
            className='flex w-full '
            onDrop={(e) => {
              console.log("drop", e.dataTransfer.files);
            }}
          >
            <label
              htmlFor='dropzone-file'
              className={cn(
                "bg-accent-background relative min-h-[250px] w-full flex items-center justify-center rounded-lg hover:bg-accent-foreground/20 transition cursor-pointer",
                { "border-b rounded-b-none": !noInput }
              )}
            >
              <div className='flex flex-col items-center'>
                <HardDriveUpload
                  size={50}
                  className='mb-4 text-accent-foreground'
                />
                <p className='mb-2 text-sm text-gray-500 text-accent-foreground'>
                  <span className='font-semibold'>Click to upload</span> or drag
                  and drop
                </p>

                <input
                  multiple
                  onChange={handleFileChange}
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
              setFiles([]);
              setShowDialog(false);
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
