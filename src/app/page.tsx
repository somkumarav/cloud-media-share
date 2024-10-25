import Image from "next/image";
import { CreateNewAlbumButton } from "@/src/components/createNewAlbum.Button";

export default function Home() {
  return (
    <main className='flex flex-col items-center pt-32 mb-3'>
      <p className='text-6xl text-center mb-2'>
        Got some photos to share <br /> with friends and family
      </p>
      <div className='mb-4'>
        <h1 className='flex items-center text-lg text-muted font-medium text-neutral-400'>
          Tap on create new album to create an album of you recent
          <span className='relative ml-1 h-[1.25rem] w-36 overflow-hidden'>
            <span className='absolute h-full w-full -translate-y-full animate-slide text-accent-foreground leading-none'>
              Trip
            </span>
            <span className='absolute h-full w-full -translate-y-full animate-slide leading-none text-accent-foreground [animation-delay:1s]'>
              Wedding
            </span>
            <span className='absolute h-full w-full -translate-y-full animate-slide leading-none text-accent-foreground [animation-delay:2s]'>
              Party
            </span>
            <span className='absolute h-full w-full -translate-y-full animate-slide leading-none text-accent-foreground [animation-delay:3s]'>
              Get Together
            </span>
          </span>
        </h1>
      </div>

      <div className='flex items-center space-x-2'>
        {/* <Button variant='secondary' size='lg'>
          Login to explore full features
        </Button> */}
        <CreateNewAlbumButton />
      </div>
      <div>
        <Image
          src='/album.png'
          height={500}
          width={1000}
          alt=''
          className='border border-accent-background rounded-xl mt-10'
          unoptimized
        />
      </div>
    </main>
  );
}
