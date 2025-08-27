"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { listImagesInDirectory } from "../actions/r2.actions";

type Media = {
  id: number;
  fileName: string;
  imageURL: string;
  fileSize: bigint;
  fileType: string;
  encryptedToken: string;
  thumbnailURL?: string;
  createdAt: Date;
  uploadedAt: Date;
  isLocal: boolean;
};

interface UploadContextType {
  media: Media[];
  isLoading?: boolean;
  isError?: boolean;
  error?: string | null;
  addUploadedImage: (image: Media) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const useUploadContext = () => {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error("useUploadContext must be used within an UploadProvider");
  }
  return context;
};

export const UploadProvider = ({
  children,
  encryptedToken,
}: {
  encryptedToken: string;
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  useEffect(() => {
    const loadBucketImages = async () => {
      try {
        const images = await listImagesInDirectory(encryptedToken); //
        const mappedImages = images.map(
          (image) =>
            ({
              id: image.id,
              fileName: image.filename,
              imageURL: image.imageURL,
              fileSize: image.fileSize,
              fileType: image.type,
              encryptedToken: encryptedToken,
              createdAt: image.createdAt,
              uploadedAt: image.uploadedAt,
              thumbnailURL: image.thumbnailURL || image.imageURL,
              isLocal: false,
            }) satisfies Media
        );
        setMedia((prev) => [...prev, ...mappedImages]);
      } catch (error) {
        console.error(error);
        setIsError(true);
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    loadBucketImages();
  }, [encryptedToken]);

  const addUploadedImage = (image: Media) => {
    setMedia((prev) => [...prev]);
  };

  const value: UploadContextType = {
    media,
    isLoading,
    isError,
    error,
    addUploadedImage,
  };

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
};
