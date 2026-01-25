import { InvalidAlbum } from "./invalid-album";
import { ImageGallery } from "@/components/image-gallery";
import { checkIfAlbumExists } from "@/actions/album.actions";
import { AlbumTopBar } from "@/components/album-topbar";
import { UploadProvider } from "@/contexts/upload-context";
import { FileInputProvider } from "@/contexts/file-input-context";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: encryptedToken } = await params;
  const isValidAlbum = await checkIfAlbumExists(encryptedToken);

  if (!isValidAlbum.status) {
    return <InvalidAlbum />;
  }

  return (
    <div>
      <UploadProvider encryptedToken={encryptedToken}>
        <FileInputProvider>
          <div className='flex w-full flex-col mb-5'>
            <AlbumTopBar
              encryptedToken={encryptedToken}
              albumName={isValidAlbum.data?.title}
              albumSize={isValidAlbum.data?.albumSize}
            />
            <ImageGallery />
          </div>
        </FileInputProvider>
      </UploadProvider>
    </div>
  );
};

export default Page;
