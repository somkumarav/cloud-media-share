import { ImageGallery } from "@/components/image-gallery";
import { checkIfAlbumExists } from "@/actions/album.actions";
import { InvalidAlbum } from "./invalid-album";
import { FileInput } from "../../../components/file-input";

const Page = async ({ params }: { params: { id: string } }) => {
  const directory = String(params.id);
  const isValidAlbum = await checkIfAlbumExists(params.id);

  if (!isValidAlbum.status) {
    return <InvalidAlbum />;
  }

  return (
    <div>
      <div className='flex w-full flex-col'>
        <p>Mini vagamon</p>

        <FileInput directory={directory} />
        <ImageGallery directory={directory} />
      </div>
    </div>
  );
};

export default Page;
