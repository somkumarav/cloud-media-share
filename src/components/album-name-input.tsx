"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlbumNameSchema, TAlbumNameSchema } from "../../types/album";
import { Button } from "./ui/button";
import { changeAlbumName } from "../actions/album.actions";
import { cn } from "../../lib/utils";
import { Check, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const AlbumNameInput = (props: {
  albumId: string;
  albumName: string;
}) => {
  const router = useRouter();
  const form = useForm<TAlbumNameSchema>({
    resolver: zodResolver(AlbumNameSchema),
    defaultValues: {
      name: props.albumName,
    },
  });

  return (
    <form
      className='w-full flex items-center space-x-2 my-5'
      onSubmit={form.handleSubmit(async (data) => {
        await changeAlbumName({
          albumId: props.albumId,
          name: data.name,
        });
      })}
    >
      {form.watch("name") !== props.albumName ? (
        <Button type='submit' size='icon'>
          <Check strokeWidth={3} />
        </Button>
      ) : (
        <ChevronLeft
          className='cursor-pointer h-10 w-10'
          onClick={() => {
            router.back();
          }}
        />
      )}
      <input
        type='text'
        {...form.register("name")}
        className={cn(
          "bg-background text-white outline-none text-4xl",
          `w-[${form.watch("name").length * 5}px]`
        )}
      />
    </form>
  );
};
