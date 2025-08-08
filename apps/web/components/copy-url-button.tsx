"use client";
import { ClipboardCheck, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const CopyURLButton = () => {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <Button
      suppressHydrationWarning
      className={cn(
        isClicked
          ? "bg-accent-foreground/30 hover:bg-accent-foreground/30"
          : "bg-accent-background hover:bg-accent-foreground/20"
      )}
      onClick={async () => {
        setIsClicked(true);
        // urlCopied.innerHTML = window.location.href;
        await navigator.clipboard.writeText(window.location.href);
        setTimeout(() => {
          setIsClicked(false);
        }, 400);
      }}
    >
      {isClicked ? (
        <ClipboardCheck strokeWidth={2} />
      ) : (
        <Link strokeWidth={3} />
      )}
      {isClicked ? "Copied" : "Copy link"}
    </Button>
  );
};
