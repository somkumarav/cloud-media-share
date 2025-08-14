"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface UploadedImage {
  id: number;
  fileName: string;
  imageUrl: string;
  fileSize: number;
  fileType: string;
  encryptedToken: string;
  uploadedAt: Date;
}

interface UploadContextType {
  uploadedImages: UploadedImage[];
  addUploadedImage: (image: UploadedImage) => void;
  clearUploadedImages: (encryptedToken: string) => void;
  getUploadedImagesForAlbum: (encryptedToken: string) => UploadedImage[];
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const useUploadContext = () => {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error("useUploadContext must be used within an UploadProvider");
  }
  return context;
};

interface UploadProviderProps {
  children: ReactNode;
}

export const UploadProvider: React.FC<UploadProviderProps> = ({ children }) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const addUploadedImage = (image: UploadedImage) => {
    setUploadedImages((prev) => [...prev, image]);
  };

  const clearUploadedImages = (encryptedToken: string) => {
    setUploadedImages((prev) =>
      prev.filter((img) => img.encryptedToken !== encryptedToken)
    );
  };

  const getUploadedImagesForAlbum = (encryptedToken: string) => {
    return uploadedImages.filter(
      (img) => img.encryptedToken === encryptedToken
    );
  };

  const value: UploadContextType = {
    uploadedImages,
    addUploadedImage,
    clearUploadedImages,
    getUploadedImagesForAlbum,
  };

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
};
