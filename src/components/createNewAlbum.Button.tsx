"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { createAlbum } from "../actions/album.actions";

export function CreateNewAlbumButton() {
  const [isPending] = useTransition();

  return (
    <form action={createAlbum}>
      <Button type='submit' disabled={isPending} size='lg'>
        {isPending ? "Creating..." : "Create new album"}
      </Button>
    </form>
  );
}
