import Link from "next/link";
import { Logo } from "@/src/components/icons/logo";
import { Button } from "@/src/components/ui/button";

export const NavBar = () => {
  return (
    <div className='sticky top-0 z-50 w-full flex items-center justify-center'>
      <div className='relative bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full py-2 flex items-center justify-center'>
        <div className='absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-background-secondary to-transparent'></div>
        <div className='flex items-center justify-between min-w-[1000px] max-w-[1400px]'>
          <Link href='/'>
            <Logo />
          </Link>
          <div>
            <div className='flex space-x-2'>
              <Button variant='secondary'>Log in</Button>
              <Button>Sign up</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
