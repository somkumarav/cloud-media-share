import { Logo } from "@/components/icons/logo";
import { Button } from "./ui/button";
import Link from "next/link";

export const NavBar = () => {
  return (
    <div className='sticky top-0 z-50 w-full flex items-center justify-center'>
      <div className='bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-xl flex items-center justify-between min-w-[1000px] max-w-[1400px] py-2 px-5 border-background-secondary mt-4'>
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
  );
};
