import { useUploadContext } from "@/contexts/upload-context";
import Image from "next/image";
import { cva, VariantProps } from "class-variance-authority";
import { cn, formatFileSize } from "@/lib/utils";
import { DownloadImageButton } from "@/components/download-image-button";
import { DeleteImageButton } from "@/components/delete-image-button";
import { Download, Edit2, EllipsisVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadImage } from "@/actions/download.actions";
import { EditMediaNameDialog } from "@/components/edit-media-name-dialog";

type TProps = {
  id: number;
  mediaId: number;
  imageURL: string;
  thumbnailURL: string;
  fileSize: bigint;
  fileName: string;
  isLocal: boolean;
  fileType: string
};
const IndividualImage = (image: TProps) => {
  const { deleteFile } = useUploadContext();
  const fileSize = formatFileSize(image.fileSize);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await deleteFile(image.mediaId);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const handleFileDownload = async (imageURL: string) => {
      try {
        const response = await fetch(imageURL);
        const blob = await response.blob();
        const blobURL = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobURL;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobURL);
      } catch (error) {
        console.error("Error downloading local image:", error);
      }
    };

    if (image.isLocal && image.imageURL) {
      handleFileDownload(image.imageURL);
      return;
    }

    const signedURL = await downloadImage(image.id);
    handleFileDownload(signedURL);
  };

  return (
    <div key={image.id} className='rounded-md border border-white/10'>
      <div className='relative aspect-square group'>
        <div className='z-10 absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 flex items-center justify-center space-x-2'>
          <DownloadImageButton
            imageId={image.id}
            isLocal={image.isLocal}
            imageURL={image.imageURL}
          />
          <DeleteImageButton mediaId={image.mediaId} />
        </div>
        {image.fileType.startsWith("video") ?
          <video
            controls
            controlsList="nodownload noremoteplayback"
            className='object-cover w-full h-full rounded-t-md'
            muted
            autoPlay
            preload="metadata"
            src={image.imageURL}
          >
            Your browser does not support the video tag.
          </video>
          : < Image
            loading='lazy'
            src={image.thumbnailURL}
            alt={image.fileName}
            className='object-cover w-full h-full rounded-t-md'
            unoptimized
            height={100}
            width={100}
          />}
      </div>
      <div className='px-2 pt-3 pb-2'>
        <p title={image.fileName} className='truncate'>
          {image.fileName}
        </p>
        <div className='flex items-center justify-between'>
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
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='outline-hidden'>
              <EllipsisVertical
                size={16}
                className='hover:text-accent-foreground transition-colors'
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <EditMediaNameDialog mediaId={image.id} currentName={image.fileName}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit2 className="hover:text-accent-foreground" /> Edit name
                </DropdownMenuItem>
              </EditMediaNameDialog>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className='hover:text-accent-foreground' /> Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant='destructive' onClick={handleDelete}>
                <Trash2 className='text-destructive' /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
