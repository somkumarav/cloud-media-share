import Image from "next/image";
import { cva, VariantProps } from "class-variance-authority";
import { cn, formatFileSize } from "@/lib/utils";
import { DownloadImageButton } from "@/components/download-image-button";

type TProps = {
  imageURL: string;
  thumbnailURL: string;
  fileSize: bigint;
  id: number;
  fileName: string;
  fileType: string;
  createdAt: Date;
  albumId: number | null;
};
const IndividualImage = (image: TProps) => {
  const fileSize = formatFileSize(Number(image.fileSize));
  return (
    <div key={image.id} className='rounded-md border border-white/10'>
      <div className='relative aspect-square group'>
        <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 flex items-center justify-center'>
          <DownloadImageButton
            image={{ key: image.fileName, url: image.imageURL }}
          />
        </div>
        <Image
          loading='lazy'
          src={image.thumbnailURL}
          alt={image.fileName}
          className='object-cover w-full h-full rounded-t-md'
          unoptimized
          height={100}
          width={100}
        />
      </div>
      <div className='px-2 pt-3 pb-2'>
        <p title={image.fileName} className='truncate'>
          {image.fileName}
        </p>
        <div>
          <FileSizePill
            fileSize={fileSize.formatted}
            className='-translate-x-[2px]'
            variant={
              image.fileSize > 1024 * 1000 * 5
                ? image.fileSize > 1024 * 1000 * 5 &&
                  image.fileSize <= 1024 * 1000 * 10
                  ? "medium"
                  : "large"
                : "small"
            }
          />
        </div>
      </div>
    </div>
  );
};

const pillVariants = cva("w-fit px-2 rounded-full mt-2 [&>p]:text-sm", {
  variants: {
    variant: {
      small: "bg-accent-background [&>p]:text-accent-foreground",
      medium: "bg-caution-background [&>p]:text-caution",
      large: "bg-destructive-background [&>p]:text-destructive",
    },
  },
  defaultVariants: {
    variant: "small",
  },
});

export interface PillProps extends VariantProps<typeof pillVariants> {
  fileSize: string;
  className?: string;
}

const FileSizePill = ({ fileSize, className, variant }: PillProps) => {
  return (
    <div className={cn(pillVariants({ variant, className }))}>
      <p>{fileSize}</p>
    </div>
  );
};

export { IndividualImage, FileSizePill };
