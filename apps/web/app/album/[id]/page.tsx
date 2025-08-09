import { InvalidAlbum } from "./invalid-album";
import { ImageGallery } from "@/components/image-gallery";
import { checkIfAlbumExists } from "@/actions/album.actions";
import { FileInput } from "@/components/file-input";
import { AlbumNameInput } from "@/components/album-name-input";
import { CopyURLButton } from "@/components/copy-url-button";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const directory = String(id);
  const isValidAlbum = await checkIfAlbumExists(id);

  if (!isValidAlbum.status) {
    return <InvalidAlbum />;
  }
  const albumName = isValidAlbum.data?.title;

  return (
    <div>
      <div className='flex w-full flex-col mb-5'>
        <div className='mb-10'>
          <AlbumNameInput
            albumId={id}
            albumName={albumName?.length ? albumName : "Name your album"}
          />
          <div className='flex items-center px-4 space-x-2'>
            <FileInput directory={directory} />
            <CopyURLButton />
          </div>
        </div>
        <ImageGallery directory={directory} />
      </div>
    </div>
  );
};

export default Page;
