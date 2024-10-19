import { CreateNewAlbumButton } from "../components/createNewAlbum.Button";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center pt-40 space-y-4'>
      <div className='flex flex-col items-center text-center'>
        <p className='text-2xl'>
          Got some photos to share <br /> with friends and family
        </p>
        <p>
          Tap on quick share with friends to create a sharable <br /> photo
          album of you recent trip, wedding, party, you name it...
        </p>
      </div>
      <div className='flex items-center space-x-2'>
        <Button variant='secondary'>Login to explore full features</Button>
        <CreateNewAlbumButton />
      </div>
    </main>
  );
}
