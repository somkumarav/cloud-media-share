import { MultiImageUploader } from "@/components/multiple-image-uploader";
import { ImageGallery } from "@/components/image-gallery";
import { checkIfAlbumExists } from "@/actions/album.actions";
import { InvalidAlbum } from "./invalid-album";

const Page = async ({ params }: { params: { id: string } }) => {
  const isValidAlbum = await checkIfAlbumExists(params.id);

  if (!isValidAlbum.status) {
    return <InvalidAlbum />;
  }

  return (
    <div>
      <div className='flex w-full flex-col'>
        <p>Mini vagamon</p>
        <MultiImageUploader directory={params.id} />
        <ImageGallery directory={String(params.id)} />
      </div>
    </div>
  );
};

export default Page;
