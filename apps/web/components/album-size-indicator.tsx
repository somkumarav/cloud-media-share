import { cn, formatFileSize } from "@/lib/utils";

export const AlbumSizeIndicator = ({ albumSize }: { albumSize?: number }) => {
  const progressWidth = albumSize
    ? Number(((albumSize / 500000000) * 100).toFixed(2))
    : 0;

  return (
    <div className='flex flex-col items-stretch min-w-40'>
      <div className='text-xs truncate'>
        {formatFileSize(albumSize ?? 0).formatted} / 1 GB
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
