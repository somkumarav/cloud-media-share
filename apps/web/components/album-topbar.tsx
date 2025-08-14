import { FileInput } from "@/components/file-input";
import { AlbumNameInput } from "@/components/album-name-input";
import { CopyURLButton } from "@/components/copy-url-button";
import { AlbumSizeIndicator } from "@/components/album-size-indicator";

export const AlbumTopBar = ({
  albumName,
  encryptedToken,
  albumSize,
}: {
  albumName?: string;
  encryptedToken: string;
  albumSize?: bigint;
}) => {
  return (
    <div className='mb-10'>
      <AlbumNameInput
        encryptedToken={encryptedToken}
        albumName={albumName?.length ? albumName : "Name your album"}
      />
      <div className='flex items-center px-4 space-x-2'>
        <FileInput encryptedToken={encryptedToken} />
        <CopyURLButton />
        <AlbumSizeIndicator albumSize={albumSize} />
      </div>
    </div>
  );
};
