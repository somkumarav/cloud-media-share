import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GIGABYTE, KILOBYTE, MEGABYTE } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(fileSize: bigint): {
  fileSize: bigint | number;
  unit: "B" | "KB" | "MB" | "GB";
  formatted: string;
} {
  if (fileSize < KILOBYTE) {
    return { fileSize, unit: "B", formatted: `${fileSize} B` };
  }

  const scaledSize = fileSize * 100n;
  if (fileSize < MEGABYTE) {
    const formattedSize = Number(scaledSize / KILOBYTE) / 100;
    return {
      fileSize: formattedSize,
      unit: "KB",
      formatted: `${formattedSize} KB`,
    };
  }

  if (fileSize < GIGABYTE) {
    const formattedSize = Number(scaledSize / MEGABYTE) / 100;
    return {
      fileSize: formattedSize,
      unit: "MB",
      formatted: `${formattedSize} MB`,
    };
  }

  const formattedSize = Number(scaledSize / GIGABYTE) / 100;
  return {
    fileSize: formattedSize,
    unit: "GB",
    formatted: `${formattedSize} GB`,
  };
}
