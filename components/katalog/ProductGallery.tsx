"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  productName,
}: {
  images: { url: string }[];
  productName: string;
}) {
  const [mainImage, setMainImage] = useState(images[0]?.url);

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 animate-fade-left">
      <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-hidden pb-1 sm:pb-0 shrink-0">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setMainImage(img.url)}
            className={`relative shrink-0 w-14 h-14 sm:w-[68px] sm:h-[68px] rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer ${
              mainImage === img.url
                ? "border-[var(--primary)] opacity-100 scale-105"
                : "border-white/10 opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={img.url}
              fill
              alt={`${productName} ${i + 1}`}
              className="object-cover"
              sizes="68px"
              quality={40}
            />
          </div>
        ))}
      </div>

      <div className="relative w-full aspect-square sm:aspect-auto rounded-2xl overflow-hidden border border-white/10 bg-white/5 sm:h-[600px]">
        <Image
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 600px"
          src={mainImage}
          alt={productName}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
