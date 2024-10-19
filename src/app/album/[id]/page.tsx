import { MultiImageUploader } from "@/components/multiple-image-uploader";
import { ImageGallery } from "@/components/image-gallery";
import { checkIfAlbumExists } from "@/actions/album.actions";
import { Button } from "@/components/ui/button";
import { EncryptedText } from "../../../components/encrypted-text";
import Link from "next/link";

const Page = async ({ params }: { params: { id: string } }) => {
  const isValidAlbum = await checkIfAlbumExists(params.id);

  if (!isValidAlbum.status) {
    return (
      <div className='pt-32 flex flex-col items-center justify-center'>
        <EncryptedText
          text='broken url encryption'
          className='text-5xl text-center font-semibold'
          leadingText={
            <p className='text-5xl text-center font-semibold'>
              Oops!
              <br />
            </p>
          }
          trailingText={
            <>
              <p className='mt-2 mb-8'>
                The URL seems to be broken, please check the URL and try again
              </p>
              <Link href='/'>
                <Button>Go Home</Button>
              </Link>
            </>
          }
        />
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
