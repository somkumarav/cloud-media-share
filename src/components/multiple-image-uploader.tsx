"use client";

import { useState } from "react";
import { uploadImagesToR2 } from "@/src/actions/r2.actions";

export const MultiImageUploader = (props: { directory: string }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<
    { fileName: string; success: boolean; message: string }[] | null
  >(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setStatus([
        { fileName: "", success: false, message: "Please select files" },
      ]);
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.set("directory", props.directory);

    try {
      const results = await uploadImagesToR2(formData);
      setStatus(results);
    } catch (error) {
      console.error(error);
      setStatus([
        {
          fileName: "",
          success: false,
          message: "An error occurred while uploading",
        },
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='p-4'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <p className='block text-sm font-medium text-gray-700'>
            Choose files
          </p>
          <input
            id='file-upload'
            name='files'
            type='file'
            multiple
            accept='image/*'
            onChange={(e) => {
              if (e.target.files) {
                setFiles(Array.from(e.target.files));
              }
            }}
            className='mt-1 block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100'
          />
        </div>
        <button
          type='submit'
          disabled={isUploading}
          className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {status && (
        <div className='mt-4 space-y-2'>
          {status.map((result, index) => (
            <div
              key={index}
              className={`p-2 ${
                result.success
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              } rounded-md`}
            >
              {result.fileName}: {result.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
