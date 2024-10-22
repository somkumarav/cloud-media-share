"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

import { cn } from "@/lib/utils";
import ImageUpload from "@/src/components/image-upload";
import { HardDriveUpload, Upload } from "lucide-react";
import { uploadImagesToR2 } from "@/src/actions/r2.actions";

export const FileInput = (props: { directory: string }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const noInput = files.length <= 0;

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.set("directory", props.directory);
    try {
      setIsUploading(true);
      const results = await uploadImagesToR2(formData);
      console.log(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
      setShowDialog(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger>
        <Button>
          <Upload strokeWidth={3} />
          Upload photos
        </Button>
      </DialogTrigger>
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
                  onChange={(e) => {
                    if (e.target.files) {
                      setFiles((prev) => [
                        ...prev,
                        ...Array.from(e.target.files || []),
                      ]);
                    }
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
                    </tr>
                  </thead>
                  <tbody className='relative divide-y max-h-[250px]'>
                    {files.map((file, index) => (
                      <ImageUpload
                        key={index}
                        // error={file.error}
                        imageURL={URL.createObjectURL(file)}
                        name={file.name}
                        size={file.size}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </form>
        <div className='flex w-full justify-end'>
          <Button size='lg' onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
      {/* <FileInput directory={directory} /> */}
    </Dialog>
  );
};
