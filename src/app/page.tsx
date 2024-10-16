"use client";

import { useState } from "react";
import { uploadImageToR2 } from "@/actions/r2.actions";

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus({ success: false, message: "Please select a file" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadImageToR2(formData);
      setStatus(result);
    } catch (error) {
      console.log(error);
      setStatus({
        success: false,
        message: "An error occurred while uploading",
      });
    }
  };

  return (
    <div className='p-4'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='file-upload'
            className='block text-sm font-medium text-gray-700'
          >
            Choose file
          </label>
          <input
            id='file-upload'
            name='file'
            type='file'
            accept='image/*'
            onChange={handleFileChange}
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
          className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          Upload
        </button>
      </form>
      {status && (
        <div
          className={`mt-4 p-4 ${
            status.success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          } rounded-md`}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}
