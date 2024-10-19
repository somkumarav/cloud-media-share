import { Logo } from "@/components/icons/logo";
import { Button } from "./ui/button";
import Link from "next/link";

export const NavBar = () => {
  return (
    <div
      // className='flex items-center justify-between border rounded-lg py-4 px-4 max-w-[1000px]'
      className='sticky top-0 z-50 w-full bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-xl flex items-center justify-between max-w-[1000px] py-3 px-6 border-background-secondary mt-10'
    >
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
  );
};
