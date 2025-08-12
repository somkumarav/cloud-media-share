import { FileInput } from "@/components/file-input";
import { AlbumNameInput } from "@/components/album-name-input";
import { CopyURLButton } from "@/components/copy-url-button";
import { AlbumSizeIndicator } from "./album-size-indicator";

export const AlbumTopBar = ({
  albumName,
  directory,
  albumSize,
}: {
  albumName?: string;
  directory: string;
  albumSize?: number;
}) => {
  return (
    <div className='mb-10'>
      <AlbumNameInput
        albumId={directory}
        albumName={albumName?.length ? albumName : "Name your album"}
      />
      <div className='flex items-center px-4 space-x-2'>
        <FileInput directory={directory} />
        <CopyURLButton />
        <AlbumSizeIndicator albumSize={albumSize} />
      </div>
    </div>
  );
};
