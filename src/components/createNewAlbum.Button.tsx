"use client";
import { useTransition } from "react";
import { Button } from "@/src/components/ui/button";
import { createAlbum } from "@/src/actions/album.actions";

export function CreateNewAlbumButton() {
  const [isPending] = useTransition();

  return (
    <form
      action={createAlbum}
      className='opacity-0 animate-top-fade-in [animation-delay:600ms;]'
    >
      <Button type='submit' disabled={isPending} size='lg'>
        {isPending ? "Creating..." : "Create new album"}
      </Button>
    </form>
  );
}
