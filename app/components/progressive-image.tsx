"use client";

import NextImage from "next/image";
import React, { useState, useEffect } from "react";

type ProgressiveImageProps = React.ComponentProps<typeof NextImage> & {
  src: string;
  fill: boolean;
  placeholderURL: string;
};

export const ProgressiveImage = ({
  src,
  placeholderURL,
  alt,
  ...props
}: ProgressiveImageProps) => {
  const [imageSrc, setImageSrc] = useState(placeholderURL);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src as any);
      setIsLoading(false);
    };
  }, [src]);

  return (
    <NextImage
      src={imageSrc as any}
      // placeholder="blur"
      // blurDataURL={placeholderURL}
      alt={alt}
      style={{
        filter: isLoading ? "blur(20px)" : "none",
        transition: "filter 0.3s ease-out",
      }}
      {...props}
    />
  );
};
