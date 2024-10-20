import { CreateNewAlbumButton } from "@/components/createNewAlbum.Button";

export default function Home() {
  return (
    <main className='flex flex-col items-center pt-40 space-y-4'>
      <div className='text-center space-y-5'>
        <p className='text-7xl'>
          Got some photos to share <br /> with friends and family
        </p>
        <p className='text-lg text-muted'>
          Tap on
          <span className='text-accent-foreground rounded-sm px-1 mx-[2px]'>
            Create new album
          </span>
          to create a sharable <br /> photo album of you recent trip, wedding,
          party, you name it...
        </p>
      </div>
      <div className='flex items-center space-x-2'>
        {/* <Button variant='secondary' size='lg'>
          Login to explore full features
        </Button> */}
        <CreateNewAlbumButton />
      </div>
    </main>
  );
}
