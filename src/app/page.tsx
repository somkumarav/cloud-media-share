import Image from "next/image";
import { CreateNewAlbumButton } from "@/src/components/createNewAlbum.Button";
import { HeroText } from "@/src/components/home/hero-text";

export default function Home() {
  return (
    <main className='flex flex-col items-center'>
      <HeroText />
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
