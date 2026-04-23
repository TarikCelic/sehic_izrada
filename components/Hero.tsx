"use client";

import Link from "next/link";
import Image from "next/image";
import HeroImg from "@/public/heroes/hero.png";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (isMountedRef.current) {
            setTimeout(() => {
              setIsInView(true);
            }, 100);
          } else {
            setIsInView(true);
          }
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex-col flex justify-center items-center px-4 sm:px-8 overflow-hidden"
    >
      <Image src={HeroImg} alt="Hero" fill className="object-cover" priority />

      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-700 ${
          isInView ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="z-10 flex flex-col items-center gap-4">
        <h1
          className={`font-sekuya text-3xl sm:text-4xl md:text-5xl lg:text-5xl max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl text-white text-center leading-snug transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          Napravljeno s <span className="text-[var(--primary)]">namjerom</span>.
          Napravljeno da <span className="text-[var(--primary)]">traje</span>.
        </h1>

        <p
          className={`text-white/70 text-center text-sm sm:text-base md:text-lg font-light tracking-wide max-w-xs sm:max-w-md md:max-w-lg transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
          style={{
            transitionDelay: isInView ? "150ms" : "0ms",
          }}
        >
          Stolovi, police i namještaj od drveta i metala — rađen rukom, za
          generacije.
        </p>

        <div
          className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 w-full sm:w-auto px-8 sm:px-0 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
          style={{
            transitionDelay: isInView ? "300ms" : "0ms",
          }}
        >
          <Link
            href="/katalog"
            className="bg-[var(--primary)] text-white px-8 py-3 font-medium tracking-wide hover:bg-[var(--primary)]/80 transition-colors text-center"
          >
            Pogledaj kolekciju
          </Link>
          <Link
            href="/about"
            className="border border-white text-white px-8 py-3 font-medium tracking-wide hover:bg-white hover:text-black transition-colors text-center"
          >
            O nama
          </Link>
        </div>
      </div>
    </section>
  );
}
