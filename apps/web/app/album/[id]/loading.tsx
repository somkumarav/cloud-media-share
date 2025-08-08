import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className='pt-32 flex flex-col items-center justify-center'>
      <Loader2 className='h-8 w-8 animate-spin' strokeWidth={3} />
      <p className='mt-2'>Checking for album...</p>
    </div>
  );
}
