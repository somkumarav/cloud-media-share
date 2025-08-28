import { CopyURLButton } from "./copy-url-button";
import { FileInput } from "./file-input";
import { EmptyGalleryBackground } from "./icons/empty-gallery-background";

export const EmptyGallery = () => {
  return (
    <div className='relative flex flex-col items-center justify-center mt-10'>
      <EmptyGalleryBackground />
      <div className='absolute bottom-0 translate-y-[50%] left-1/2 translate-x-[-50%] space-y-3'>
        <p>Add images to cloud to see them here</p>
        <div className='flex items-center space-x-2'>
          <CopyURLButton />
          <FileInput />
        </div>
      </div>
    </div>
  );
};
