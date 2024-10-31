export const HeroText = () => {
  return (
    <div className='opacity-0 animate-top-fade-in [animation-delay:400ms;]'>
      <p className='text-6xl text-center mb-2'>
        Got some photos to share <br /> with friends and family
      </p>
      <div className='mb-4'>
        <h1 className='flex items-center text-lg text-muted font-medium text-neutral-400'>
          Tap on create new album to create an album of you recent
          <span className='relative ml-1 h-[1.5rem] w-36 overflow-hidden translate-y-[0.2rem]'>
            <span className='absolute h-full w-full -translate-y-full animate-slide text-accent-foreground leading-none'>
              Trip 🏕️
            </span>
            <span className='absolute h-full w-full -translate-y-full animate-slide leading-none text-accent-foreground [animation-delay:1.5s]'>
              Wedding 💍
            </span>
            <span className='absolute h-full w-full -translate-y-full animate-slide leading-none text-accent-foreground [animation-delay:3s]'>
              Party 🪩
            </span>
            <span className='absolute h-full w-full -translate-y-full animate-slide leading-none text-accent-foreground [animation-delay:4.5s]'>
              Get Together 🚀
            </span>
          </span>
        </h1>
      </div>
    </div>
  );
};
