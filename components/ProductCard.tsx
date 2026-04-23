"use client";

import React from 'react'
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Product, ProductImage } from "@prisma/client"

type ProductWithImages = Product & {
    images: ProductImage[];
};

interface ProductCardProps {
    product: ProductWithImages;
    hasWhite: boolean;
    hasBlack: boolean;
    hasWooden: boolean;
}

const ProductCard = ({ product, hasWhite, hasBlack, hasWooden }: ProductCardProps) => {
    const pathname = usePathname();
    const isFavourites = pathname === "/favourites";

    const cardStyles = isFavourites
        ? "bg-white border-black/10 shadow-sm"
        : "bg-white/5 border-white/20";

    const textPrimary = isFavourites ? "text-black" : "text-white";
    const textSecondary = isFavourites ? "text-gray-600" : "text-gray-400";
    const borderStyle = isFavourites ? "border-black/20" : "border-white/20";

    return (
        <Link
            href={`/katalog/${product.id}`}
            className={`cursor-pointer group flex flex-col rounded-xl overflow-hidden border transition-all hover:border-[var(--primary)] ${cardStyles}`}
        >
            <div className="relative aspect-square w-full">
                {product.images[0]?.url ? (
                    <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 322px"
                        className="object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                        Nema slike
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                    <h3 className={`${textPrimary} text-2xl font-bold truncate`}>
                        {product.name}
                    </h3>
                    <div className="flex gap-3 mb-2">
                        {hasWhite  && <div className={`w-4 h-4 rounded-full bg-white outline ${isFavourites ? 'outline-black/10' : 'outline-white/20'} outline-offset-2`} title="Bijela" />}
                        {hasBlack  && <div className={`w-4 h-4 rounded-full bg-black outline ${isFavourites ? 'outline-black/10' : 'outline-white/20'} outline-offset-2`} title="Crna" />}
                        {hasWooden && <div className={`w-4 h-4 rounded-full bg-[#8B4513] outline ${isFavourites ? 'outline-black/10' : 'outline-white/20'} outline-offset-2`} title="Drvo" />}
                    </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className={textPrimary}>{product.price} KM</span>
                    <span className={`text-xs ${textSecondary} border rounded-md px-2 py-1 ${borderStyle} lowercase first-letter:uppercase`}>
                        {product.category}
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard;