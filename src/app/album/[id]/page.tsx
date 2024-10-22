import { ImageGallery } from "@/components/image-gallery";
import { checkIfAlbumExists } from "@/actions/album.actions";
import { InvalidAlbum } from "./invalid-album";
import { FileInput } from "../../../components/file-input";
import { AlbumNameInput } from "../../../components/album-name-input";

const Page = async ({ params }: { params: { id: string } }) => {
  const directory = String(params.id);
  const isValidAlbum = await checkIfAlbumExists(params.id);

  if (!isValidAlbum.status) {
    return <InvalidAlbum />;
  }
  const albumName = isValidAlbum.data?.title;

  return (
    <div>
      <div className='flex w-full flex-col'>
        <AlbumNameInput
          albumId={params.id}
          albumName={albumName?.length ? albumName : "Name your album"}
        />

        <FileInput directory={directory} />
        <ImageGallery directory={directory} />
      </div>
    </div>
  );
};

export default Page;
