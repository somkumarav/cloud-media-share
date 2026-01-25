"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"
import { getAllImagesFromAlbum } from "@/actions/album.actions";
import {
  deleteMedia,
  getSignedURL,
  uploadCompleted,
} from "@/actions/upload.actions";
import { ServerActionReturnType } from "@/types/api.types";
import { editMediaName } from "@/actions/media.actions";

type Media = {
  id: number;
  mediaId: number;
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
  uploadFile: (
    file: File,
    onProgress?: (percent: number) => void
  ) => Promise<{
    status: boolean;
    message: string;
    mediaId: number | undefined;
  }>;
  deleteFile: (mediaId: number) => Promise<ServerActionReturnType>;
  editFileName: (mediaId: number, newName: string) => Promise<ServerActionReturnType>;
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
        const images = await getAllImagesFromAlbum(encryptedToken);
        const mappedImages = images.map(
          (image) =>
            ({
              id: image.id,
              mediaId: image.id,
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

  const uploadFile = async (file: File, onProgress?: (percent: number) => void) => {
    const isVideo = file.type.startsWith("video/")
    const checksum = isVideo ? null : await computeSHA256(file)

    const getSignedURLAction = await getSignedURL({
      fileName: file.name,
      encryptedToken,
      fileSize: file.size,
      mimeType: file.type,
      checksum: checksum,
    });

    if (!getSignedURLAction.status) {
      console.error(getSignedURLAction);
      throw new Error(getSignedURLAction.message ?? "Failed to get signed URL");
    }
    if (!getSignedURLAction.data?.signedURL) {
      console.error(getSignedURLAction);
      throw new Error(getSignedURLAction.message ?? "No signed URL returned");
    }


    const uploadToBucket = await axios.put(getSignedURLAction.data.signedURL, file, {
      headers: { "Content-Type": file.type },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    if (uploadToBucket.status !== 200) {
      console.error(uploadToBucket);
      throw new Error("Upload failed");
    }

    const uploadCompleteResponse = await uploadCompleted({
      mediaId: getSignedURLAction.data.mediaId,
    });

    if (!uploadCompleteResponse.status) {
      console.log(uploadCompleteResponse);
      throw new Error("Upload completion failed");
    }

    const imageUrl = URL.createObjectURL(file);
    setMedia((prev) => [
      {
        id: uploadCompleteResponse.data?.imageId ?? 0,
        mediaId: getSignedURLAction.data?.mediaId ?? 0,
        fileName: file.name,
        imageURL: imageUrl,
        fileSize: BigInt(file.size),
        fileType: file.type,
        encryptedToken: encryptedToken,
        uploadedAt: new Date(),
        createdAt: new Date(),
        isLocal: true,
        thumbnailURL: imageUrl,
      },
      ...prev,
    ]);
    return { status: true, message: "Upload successful", mediaId: uploadCompleteResponse?.data?.imageId };
  };

  const deleteFile = async (mediaId: number) => {
    const file = media.find((file) => file.mediaId === mediaId);
    if (!file) throw new Error("File not found");

    const res = await deleteMedia({ mediaId });
    if (res.status) {
      setMedia((prev) => prev.filter((item) => item.mediaId !== mediaId));
    }

    return res;
  };

  const editFileName = async (mediaId: number, newName: string) => {
    const file = media.find(file => file.mediaId == mediaId)
    if (!file) throw new Error("File not found");

    const res = await editMediaName({ mediaId, newName })
    if (res.status) {
      setMedia(prev =>
        prev.map(item =>
          item.mediaId === mediaId
            ? { ...item, fileName: newName }
            : item
        )
      );
    }
    return res
  }

  const value: UploadContextType = {
    media,
    isLoading,
    isError,
    error,
    uploadFile,
    deleteFile,
    editFileName
  };

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
};

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};
