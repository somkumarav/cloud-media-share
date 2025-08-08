import Link from "next/link";
import { CreateNewAlbumButton } from "@/components/createNewAlbum.Button";
import { EncryptedText } from "@/components/encrypted-text";
import { Button } from "@/components/ui/button";

export const InvalidAlbum = () => {
  return (
    <div className='pt-44 flex flex-col items-center justify-center'>
      <EncryptedText
        text='Oops! broken url'
        className='text-5xl text-center font-semibold'
        // leadingText={
        //   <p className='text-5xl text-center font-semibold'>
        //     Oops!
        //     <br />
        //   </p>
        // }
        trailingText={
          <>
            <p className='mt-2 mb-8 text-muted'>
              The URL seems to be broken, please check the URL and try again
            </p>
            <div className='flex items-center space-x-2'>
              <Link href='/'>
                <Button size='lg' variant='secondary'>
                  Return to home
                </Button>
              </Link>
              <CreateNewAlbumButton />
            </div>
          </>
        }
      />
    </div>
  );
};
