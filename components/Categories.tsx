"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const CATEGORIES = [
  {
    label: "Stolovi",
    desc: "Masivno drvo i metal",
    href: "/katalog?categories=STOLOVI",
    image: "/categories/stol.jpg",
  },
  {
    label: "Police",
    desc: "Modularni sistemi",
    href: "/katalog?categories=POLICE",
    image: "/categories/polica.jpg",
  },
  {
    label: "Po narudžbi",
    desc: "Tvoj dizajn, naš zanat",
    href: "/kontakt",
    image: "/categories/narudzba.jpg",
  },
  {
    label: "Stolice",
    desc: "Udobnost i karakter",
    href: "/katalog?categories=STOLICE",
    image: "/categories/stolica.jpg",
  },
];

export default function Categories() {
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
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20">
      <div
        className={`text-center mb-12 px-6 will-change-transform transition-all duration-700 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="font-mono text-sm tracking-widest text-[var(--primary)]">
          KOLEKCIJA
        </p>
        <h2 className="font-sekuya text-3xl md:text-4xl mt-1">
          Istražite kategorije
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 md:hidden">
        {CATEGORIES.map((cat, idx) => (
          <Link
            key={cat.label}
            href={cat.href}
            className={`relative h-52 overflow-hidden group rounded-sm will-change-transform transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: isInView ? `${(idx + 1) * 50}ms` : "0ms",
            }}
          >
            <Image
              src={cat.image}
              alt={cat.label}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 z-10">
              <h3 className="font-sekuya text-white text-lg tracking-widest">
                {cat.label}
              </h3>
              <p className="text-white/70 text-xs font-mono mt-1 tracking-wide">
                {cat.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="hidden md:flex justify-center">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-8 max-w-fit">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.label}
              href={cat.href}
              className={`relative flex-none w-94 h-120 overflow-hidden group rounded-sm will-change-transform transition-all duration-700 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: isInView ? `${(idx + 1) * 50}ms` : "0ms",
              }}
            >
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-[var(--primary)]/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 p-6 z-10">
                <h3 className="font-sekuya text-white text-2xl tracking-widest">
                  {cat.label}
                </h3>
                <p className="text-white/70 text-sm font-mono mt-1 tracking-wide">
                  {cat.desc}
                </p>
                <span className="inline-block mt-4 text-white/0 group-hover:text-white text-xs font-mono tracking-widest transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  POGLEDAJ →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
