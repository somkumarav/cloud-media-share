"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface UploadedImage {
  id: string;
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
  removeUploadedImage: (id: string) => void;
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

  // Cleanup old images every 5 minutes
  useEffect(() => {
    const cleanupInterval = setInterval(
      () => {
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

        setUploadedImages((prev) =>
          prev.filter((img) => img.uploadedAt > fiveMinutesAgo)
        );
      },
      5 * 60 * 1000
    ); // 5 minutes

    return () => clearInterval(cleanupInterval);
  }, []);

  // Cleanup on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      setUploadedImages([]);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const addUploadedImage = (image: UploadedImage) => {
    setUploadedImages((prev) => [...prev, image]);
  };

  const removeUploadedImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
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
    removeUploadedImage,
    clearUploadedImages,
    getUploadedImagesForAlbum,
  };

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
};
