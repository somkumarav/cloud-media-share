"use client"
import React, { createContext, useContext, useState, useCallback } from "react";
import { acceptedFileType } from "@repo/utils";
import { useUploadContext } from "./upload-context";

type FileState = {
  id: string | number;
  file: File;
  preview: string;
  isUploaded: boolean;
  isError: boolean;
  progress: number;
  error?: string;
  fileType: "VIDEO" | "IMAGE";
};

interface FileInputContextType {
  files: FileState[];
  isUploading: boolean;
  uploadedCount: number;
  addFiles: (fileList: FileList) => void;
  removeFile: (id: string | number) => Promise<void>;
  clearFiles: () => void;
}

const FileInputContext = createContext<FileInputContextType | undefined>(undefined);

export const FileInputProvider = ({ children }: { children: React.ReactNode }) => {
  const { uploadFile, deleteFile } = useUploadContext();
  const [files, setFiles] = useState<FileState[]>([]);
  const isUploading = files.some((f) => !f.isUploaded && !f.isError);
  const uploadedCount = files.filter((file) => file.isUploaded).length

  const uploadSingleMedia = async (localId: string, file: File) => {
    try {
      const uploadResponse = await uploadFile(file, (percent) => {
        setFiles((prev) =>
          prev.map((item) =>
            item.id === localId ? { ...item, progress: percent } : item
          )
        );
      });

      setFiles((prev) =>
        prev.map((item) =>
          item.id === localId
            ? {
              ...item,
              id: uploadResponse.mediaId ?? item.id,
              progress: 100,
              isUploaded: true,
            }
            : item
        )
      );
    } catch (error) {
      setFiles((prev) =>
        prev.map((item) =>
          item.id === localId
            ? {
              ...item,
              isError: true,
              error: error instanceof Error ? error.message : "Upload failed",
            }
            : item
        )
      );
    }
  };

  const addFiles = useCallback((fileList: FileList) => {
    const newEntries: FileState[] = Array.from(fileList)
      .filter((file) => acceptedFileType.includes(file.type))
      .map((file) => {
        const localId = crypto.randomUUID();
        const state: FileState = {
          id: localId,
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          isUploaded: false,
          isError: false,
          fileType: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
        };

        uploadSingleMedia(localId, file);
        return state;
      });

    setFiles((prev) => [...prev, ...newEntries]);
  }, [uploadFile]);

  const removeFile = async (id: string | number) => {
    const fileToRemove = files.find((f) => f.id === id);
    if (!fileToRemove) return;

    if (fileToRemove.isUploaded && typeof id === "number") {
      try {
        await deleteFile(id);
      } catch (err) {
        console.error("Failed to delete from server", err);
        return;
      }
    }

    URL.revokeObjectURL(fileToRemove.preview);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearFiles = () => {
    files.forEach(f => URL.revokeObjectURL(f.preview));
    setFiles([]);
  };

  return (
    <FileInputContext.Provider value={{
      files,
      isUploading,
      uploadedCount,
      addFiles,
      removeFile,
      clearFiles
    }}>
      {children}
    </FileInputContext.Provider>
  );
};

export const useFileInput = () => {
  const context = useContext(FileInputContext);
  if (!context) throw new Error("useFileInput must be used within FileInputProvider");
  return context;
};