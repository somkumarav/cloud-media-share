"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { editMediaName } from "@/actions/media.actions"; // Import your existing action
import { Loader2 } from "lucide-react";

export const EditMediaNameDialog = ({
  children,
  mediaId,
  currentName,
}: {
  children: ReactNode;
  mediaId: number;
  currentName: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState(currentName);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Calling your specific action with the expected arguments
      const result = await editMediaName({
        mediaId: mediaId,
        newName: newName
      });

      if (result.status) {
        // Optional: Add toast notification here
        setIsOpen(false);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Failed to update name", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Edit media name</DialogTitle>
            <DialogDescription>
              Enter the new name for your file.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="media-name">Name</Label>
              <Input
                id="media-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading || newName === currentName}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};