import { InvalidAlbum } from "./invalid-album";
import { ImageGallery } from "@/components/image-gallery";
import { checkIfAlbumExists } from "@/actions/album.actions";
import { AlbumTopBar } from "@/components/album-topbar";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const directory = String(id);
  const isValidAlbum = await checkIfAlbumExists(id);

  if (!isValidAlbum.status) {
    return <InvalidAlbum />;
  }

  return (
    <div>
      <div className='flex w-full flex-col mb-5'>
        <AlbumTopBar
          directory={directory}
          albumName={isValidAlbum.data?.title}
          albumSize={isValidAlbum.data?.albumSize}
        />
        <ImageGallery directory={directory} />
      </div>
    </div>
  );
};

export default Page;
