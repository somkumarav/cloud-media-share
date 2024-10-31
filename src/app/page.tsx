import Image from "next/image";
import { CreateNewAlbumButton } from "@/src/components/createNewAlbum.Button";
import { HeroText } from "@/src/components/home/hero-text";

export default function Home() {
  return (
    <main className='flex flex-col items-center'>
      <div className='mt-32 mb-3 opacity-0 animate-top-fade-in [animation-delay:200ms;]'>
        <div className='py-[2px] px-5 rounded-full bg-accent-background text-accent-foreground'>
          Created with love by somu. 😶‍🌫️
        </div>
      </div>
      <HeroText />
      <div className='flex items-center space-x-2'>
        {/* <Button variant='secondary' size='lg'>
          Login to explore full features
        </Button> */}
        <CreateNewAlbumButton />
      </div>
      <div className='opacity-0 animate-fade-in [animation-delay:1500ms;]'>
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
