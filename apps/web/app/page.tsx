import Image from "next/image";
import { CreateNewAlbumButton } from "@/components/createNewAlbum.Button";
import { HeroText } from "@/components/home/hero-text";
import { PillCTA } from "../components/pillCTA";

export default function Home() {
  return (
    <main className='flex flex-col items-center'>
      <PillCTA />
      <HeroText />
      <div className='flex items-center space-x-2 opacity-0 animate-top-fade-in [animation-delay:600ms;]'>
        {/* <Button variant='secondary' size='lg'>
          Login to explore full features
        </Button> */}
        <CreateNewAlbumButton />
      </div>
      <div className='opacity-0 animate-fade-in [animation-delay:1200ms;]'>
        <Image
          src='/album.png'
          height={500}
          width={1000}
          alt='Hero image'
          className='border border-accent-background rounded-xl rounded-b-none mt-10'
          unoptimized
        />
      </div>
    </main>
  );
}
