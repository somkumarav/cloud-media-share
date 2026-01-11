"use client";
import { ReactNode, useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import { RoughAnnotationConfig } from "rough-notation/lib/model";

export const RoughHighlightedText = ({
  children,
  options = {
    type: "underline",
  },
}: {
  children: ReactNode;
  options?: RoughAnnotationConfig;
}) => {
  const elementRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const annotation = annotate(element, options);
    annotation.show();
  }, [elementRef, options]);

  return <span ref={elementRef}>{children}</span>;
};
