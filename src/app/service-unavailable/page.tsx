import Link from "next/link";
import { Button } from "@/src/components/ui/button";

const ServiceUnavailable = () => {
  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center text-center'>
      <p className='text-4xl'>
        <span className='text-destructive'>Oops! </span>
        <br />
        Service is temporarily not available
      </p>
      <p className='max-w-[900px] mt-2'>
        This project is not funded and the free tier of the storage is at its
        limit so the service will be temporarily not available! Please come back
        later when the storage gets cleared normally in a week feel free to view
        already created album. <br />
        <span className=''> Sorry for the inconvenience!</span>
      </p>
      <div className='mt-8'>
        <Link href='/'>
          <Button size='lg'>Return to home</Button>
        </Link>
      </div>
    </div>
  );
};

export default ServiceUnavailable;
