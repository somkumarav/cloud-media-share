import { MultiImageUploader } from "@/components/multiple-image-uploader";
import { ImageGallery } from "@/components/image-gallery";

const Page = ({ params }: { params: { id: string } }) => {
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
