import { InvalidAlbum } from "./invalid-album";
import { ImageGallery } from "@/src/components/image-gallery";
import { checkIfAlbumExists } from "@/src/actions/album.actions";
import { FileInput } from "@/src/components/file-input";
import { AlbumNameInput } from "@/src/components/album-name-input";
import { CopyURLButton } from "@/src/components/copy-url-button";

const Page = async ({ params }: { params: { id: string } }) => {
  const directory = String(params.id);
  const isValidAlbum = await checkIfAlbumExists(params.id);

  if (!isValidAlbum.status) {
    return <InvalidAlbum />;
  }
  const albumName = isValidAlbum.data?.title;

  return (
    <div>
      <div className='flex w-full flex-col mb-5'>
        <div className='mb-10'>
          <AlbumNameInput
            albumId={params.id}
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
