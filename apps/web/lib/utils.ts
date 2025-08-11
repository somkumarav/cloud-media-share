import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function truncateDecimals(number: number, decimals: number) {
  const factor = Math.pow(10, decimals);
  return Math.trunc(number * factor) / factor;
}

export function formatFileSize(fileSize: number): {
  fileSize: number;
  unit: "B" | "KB" | "MB" | "GB";
  formatted: string;
} {
  if (fileSize < 1024)
    return { fileSize, unit: "B", formatted: `${fileSize} B` };

  if (fileSize < 1024 * 1000) {
    const formattedSize = truncateDecimals(fileSize / 1024, 0);
    return {
      fileSize: formattedSize,
      unit: "KB",
      formatted: `${formattedSize} KB`,
    };
  }

  if (fileSize < 1024 * 1024 * 1000) {
    const formattedSize = truncateDecimals(fileSize / (1024 * 1000), 2);
    return {
      fileSize: formattedSize,
      unit: "MB",
      formatted: `${formattedSize} MB`,
    };
  }

  const formattedFileSize = truncateDecimals(
    fileSize / (1024 * 1000 * 1000),
    2
  );
  return {
    fileSize: truncateDecimals(fileSize / (1024 * 1000 * 1000), 2),
    unit: "GB",
    formatted: `${formattedFileSize} GB`,
  };
}
