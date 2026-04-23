"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const PRODUCTS = [
  {
    id: 1,
    name: "Sto od hrasta",
    price: "890 KM",
    href: "/katalog/sto-od-hrasta",
    image: "/katalog/sto-hrast.jpg",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Industrijska polica",
    price: "450 KM",
    href: "/katalog/industrijska-polica",
    image: "/katalog/polica.jpg",
    tag: null,
  },
  {
    id: 3,
    name: "Metalna stolica",
    price: "280 KM",
    href: "/katalog/metalna-stolica",
    image: "/katalog/stolica.jpeg",
    tag: "Novo",
  },
  {
    id: 4,
    name: "Komoda",
    price: "1.200 KM",
    href: "/katalog/radni-sto",
    image: "/katalog/komoda.jpeg",
    tag: null,
  },
];

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (hasAnimatedRef.current) {
            setTimeout(() => {
              setIsInView(true);
            }, 50);
          } else {
            setIsInView(true);
            hasAnimatedRef.current = true;
          }
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className={`text-center mb-8 md:mb-12 will-change-transform transition-all duration-700 ${
        isInView 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-8"
      }`}>
        <p className="font-mono text-xs sm:text-sm tracking-widest text-[var(--primary)]">IZDVOJENO</p>
        <h2 className="font-sekuya text-2xl sm:text-3xl md:text-4xl mt-1">Istaknuti proizvodi</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {PRODUCTS.map((product, idx) => (
          <Link
            key={product.id}
            href={product.href}
            className={`group flex flex-col will-change-transform transition-all duration-700 ${
              isInView 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: isInView ? `${(idx + 1) * 50}ms` : "0ms"
            }}
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-sm bg-[#f0ece6]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {product.tag && (
                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 font-mono text-[0.6rem] sm:text-[0.65rem] tracking-widest bg-[var(--primary)] text-white px-1.5 py-0.5 sm:px-2 sm:py-1">
                  {product.tag.toUpperCase()}
                </span>
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-500">
                <button className="w-full bg-white text-black font-mono text-[0.6rem] sm:text-xs tracking-widest py-2 sm:py-3 hover:bg-[var(--primary)] hover:text-white transition-colors duration-300">
                  DODAJ U KOŠARICU
                </button>
              </div>
            </div>

            <div className="mt-2 sm:mt-3 flex justify-between items-start gap-2">
              <h3 className="font-medium text-xs sm:text-sm tracking-wide group-hover:text-[var(--primary)] transition-colors duration-300 leading-snug">
                {product.name}
              </h3>
              <span className="text-xs sm:text-sm text-(--primary) font-bold whitespace-nowrap">
                {product.price}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className={`flex justify-center mt-8 md:mt-12 will-change-transform transition-all duration-700 ${
        isInView 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: isInView ? `${(PRODUCTS.length + 1) * 50}ms` : "0ms"
      }}>
        <Link
          href="/katalog"
          className="font-mono text-xs sm:text-sm tracking-widest border border-black px-6 sm:px-10 py-3 sm:py-4 hover:bg-black hover:text-white transition-colors duration-300"
        >
          POGLEDAJ SVE PROIZVODE →
        </Link>
      </div>
    </section>
  );
}