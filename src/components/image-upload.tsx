"use client";
export type ImageResponseData = {
  success: boolean;
  alt: string;
  message: string;
};

import { CircleAlert, CircleCheckBig, Loader2 } from "lucide-react";
import Image from "next/image";

const ImageUpload = (props: {
  name: string;
  size: number;
  isUploaded: boolean;
  imageURL: string;
  isError: boolean;
}) => {
  return (
    <tr>
      <td className='px-6 py-4 whitespace-nowrap text-sm'>
        <div className='relative flex h-12 w-20'>
          <Image
            className='h-10 w-10 object-cover'
            src={props.imageURL}
            fill
            alt={props.name}
            unoptimized
          />
        </div>
      </td>
      <td className='px-6 py-4 truncate whitespace-normal text-sm font-medium'>
        <div className=''>
          <p>{props.name}</p>
        </div>
      </td>
      <td className={"px-6 py-4 whitespace-nowrap text-sm"}>
        {(props.size / 1000000).toFixed(2)} MB
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm'>
        {props.isError ? (
          <div className='flex flex-col items-center text-destructive'>
            <CircleAlert />
            <p className='text-xs font-medium'>1GB Cap exceeded</p>
          </div>
        ) : props.isUploaded ? (
          <CircleCheckBig />
        ) : (
          <Loader2 className='animate-spin' strokeWidth={3} />
        )}
      </td>
    </tr>
  );
};

ImageUpload.displayName = "ImageUpload";

export default ImageUpload;
