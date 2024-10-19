import { MultiImageUploader } from "@/components/multiple-image-uploader";
import { ImageGallery } from "@/components/image-gallery";
import { checkIfAlbumExists } from "@/actions/album.actions";
import { Button } from "@/components/ui/button";

const Page = async ({ params }: { params: { id: string } }) => {
  const isValidAlbum = await checkIfAlbumExists(params.id);

  if (!isValidAlbum.status) {
    return (
      <div className='pt-32 flex flex-col items-center justify-center space-y-4'>
        <p className='text-5xl text-center font-semibold'>
          Oops!
          <br />
          broken URL
        </p>
        <p className=''>
          The URL seems to be broken, please check the URL and try again
        </p>
        <div>
          <Button>Go Home</Button>
        </div>
      </div>
    );
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
