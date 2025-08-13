import { cn, formatFileSize } from "@/lib/utils";
import { GIGABYTE } from "@/lib/constants";

export const AlbumSizeIndicator = ({ albumSize }: { albumSize?: bigint }) => {
  const totalSize = GIGABYTE;
  const rawProgressWidth = albumSize ? (albumSize * 10000n) / totalSize : 0n;
  const progressWidth = Number(rawProgressWidth) / 100;

  return (
    <div className='flex flex-col items-stretch min-w-40'>
      <div className='text-xs truncate'>
        {formatFileSize(albumSize ?? 0n).formatted} / 1 GB
      </div>
      <div
        className={cn(
          "h-1 w-full bg-accent-background rounded-full",
          progressWidth >= 80 && progressWidth <= 90
            ? "bg-caution-background"
            : progressWidth > 90 && "bg-destructive-background"
        )}
      >
        <div
          style={{ width: `${progressWidth}%` }}
          className={cn(
            "h-1 min-w-1 bg-accent-foreground rounded-full",
            progressWidth >= 80 && progressWidth <= 90
              ? "bg-caution"
              : progressWidth > 90 && "bg-destructive"
          )}
        ></div>
      </div>
    </div>
  );
};
