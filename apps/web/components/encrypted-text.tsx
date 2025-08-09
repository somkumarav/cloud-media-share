"use client";
import { ReactNode, useEffect, useState } from "react";

interface EncryptedTextProps {
  leadingText?: ReactNode;
  text: string;
  interval?: number;
  trailingText?: ReactNode;
  className?: string;
}

const chars = "-_~`!@#$%^&*()+=[]{}|;:,.<>?";

export const EncryptedText = ({
  text,
  leadingText,
  trailingText,
  className,
  interval = 50,
}: EncryptedTextProps) => {
  const [outputText, setOutputText] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (outputText !== text) {
      timer = setInterval(() => {
        if (outputText.length < text.length) {
          setOutputText((prev) => prev + text[prev.length]);
        } else {
          clearInterval(timer);
        }
      }, interval);
    }

    return () => clearInterval(timer);
  }, [text, interval, outputText]);

  const remainder =
    outputText.length < text.length
      ? text
          .slice(outputText.length)
          .split("")
          .map(() => chars[Math.floor(Math.random() * chars.length)])
          .join("")
      : "";

  if (!isMounted) {
    return <span>{"  "}</span>;
  }

  return (
    <>
      {leadingText}
      <span className={className}>
        {outputText}
        {remainder}
      </span>
      {trailingText}
    </>
  );
};
