import Link from "next/link";

export const PillCTA = () => {
  return (
    <div className='mt-32 mb-3 opacity-0 animate-top-fade-in [animation-delay:200ms;]'>
      <Link
        href='https://portfolio-4rc.pages.dev'
        target='_blank'
        className='py-[2px] px-5 rounded-full bg-accent-background text-accent-foreground hover:bg-accent-foreground/20 text-xs md:text-base transition-colors duration-300'
      >
        Created with love by somu. 😶‍🌫
      </Link>
    </div>
  );
};
