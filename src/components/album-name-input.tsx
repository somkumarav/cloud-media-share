"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlbumNameSchema, TAlbumNameSchema } from "../../types/album";
import { Button } from "./ui/button";
import { changeAlbumName } from "../actions/album.actions";

export const AlbumNameInput = (props: {
  albumId: string;
  albumName: string;
}) => {
  const form = useForm<TAlbumNameSchema>({
    resolver: zodResolver(AlbumNameSchema),
    defaultValues: {
      name: props.albumName,
    },
  });

  return (
    <form
      className='flex items-center space-x-2 my-5'
      onSubmit={form.handleSubmit(async (data) => {
        await changeAlbumName({
          albumId: props.albumId,
          name: data.name,
        });
      })}
    >
      <input
        type='text'
        {...form.register("name")}
        className='bg-background text-white outline-none text-4xl'
      />
      {form.watch("name") !== props.albumName ? (
        <Button type='submit'>submit</Button>
      ) : null}
    </form>
  );
};
