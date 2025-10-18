"use client";
import { Button } from "@/components/ui/button";
import { useUploadContext } from "@/contexts/upload-context";
import { Trash2 } from "lucide-react";

export const DeleteImageButton = (props: { mediaId: number }) => {
  const { deleteFile } = useUploadContext();
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await deleteFile(props.mediaId);
  };

  return (
    <Button
      onClick={(e) => handleDelete(e)}
      variant='destructive'
      className='p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#a52222]'
      aria-label='Delete image'
    >
      <Trash2 className='w-6 h-6' />
    </Button>
  );
};
