import { RoughHighlightedText } from "@/components/ui/rough-notation-text";

export const HeroText = () => {
  return (
    <div className='opacity-0 animate-top-fade-in [animation-delay:400ms;]'>
      <p className='text-2xl md:text-6xl text-center mb-2 text-gradient'>
        Got some photos to share <br /> with friends and family
      </p>
      <div className='mb-4 flex flex-col items-center text-muted font-medium text-sm md:text-lg'>
        <p className='md:hidden'>Tap on create new album to create an</p>
        <h1 className='flex items-center'>
          <p className='hidden md:block pr-1'>
            Tap on create new
            <RoughHighlightedText
              options={{ type: "underline", color: "#68cc55" }}
            >
              {" album "}
            </RoughHighlightedText>
            to create an album of your recent
          </p>
          <span className='relative ml-1 h-[1.1rem] md:h-[1.5rem] w-28 md:w-36 overflow-hidden inline-block align-bottom'>
            <span className='absolute inset-0 animate-slide text-accent-foreground [animation-delay:0s]'>
              Trip 🏕️
            </span>
            <span className='absolute inset-0 animate-slide text-accent-foreground [animation-delay:1.5s]'>
              Wedding 💍
            </span>
            <span className='absolute inset-0 animate-slide text-accent-foreground [animation-delay:3s]'>
              Party 🪩
            </span>
            <span className='absolute inset-0 animate-slide text-accent-foreground [animation-delay:4.5s]'>
              Get Together 🚀
            </span>
          </span>
        </h1>
      </div>
    </div>
  );
};
