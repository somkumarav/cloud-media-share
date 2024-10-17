import { MultiImageUploader } from "@/components/multiple-image-uploader";
import { ImageGallery } from "../components/image-gallery";

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <h1 className='text-4xl font-bold mb-8'>R2 Multi-Image Uploader</h1>
      <MultiImageUploader />
      <ImageGallery />
    </main>
  );
}
