"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const CHAPTERS = [
  {
    label: "01 — Materijal",
    title: "Biramo svaki komad drveta rukom.",
    desc: "Ne radimo sa industrijskim pločama. Svaki sto počinje od masivnog drveta koje sami selektujemo — po godovima, boji i karakteru.",
    image: "/brand/materijal.png",
  },
  {
    label: "02 — Dizajn",
    title: "Svaki komad nastaje na papiru.",
    desc: "Prije nego alat dotakne drvo, dizajn živi u skicama. Proporcije, spojevi, završna obrada — sve se planira unaprijed.",
    image: "/brand/dizajn.png",
  },
  {
    label: "03 — Izrada",
    title: "Ruke koje znaju šta rade.",
    desc: "Naši majstori imaju desetljeća iskustva. Bez CNC mašina, bez prečica — samo zanat koji se prenosi s koljena na koljeno.",
    image: "/brand/izrada.png",
  },
  {
    label: "04 — Dostava",
    title: "Do tvojih vrata, bez kompromisa.",
    desc: "Svaki komad pakujemo kao da šaljemo nešto vrijedno — jer jeste. Bijela rukavica dostava, montaža uključena.",
    image: "/brand/dostava.jpeg",
  },
];

export default function BrandStory() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => {
      if (!sectionRef.current) return;
      const { top, height } = sectionRef.current.getBoundingClientRect();
      const scrolled = -top;
      const total = height - window.innerHeight;
      const progress = Math.min(Math.max(scrolled / total, 0), 1);
      setActive(
        Math.min(Math.floor(progress * CHAPTERS.length), CHAPTERS.length - 1),
      );
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <section className="md:hidden py-16 px-6">
        {CHAPTERS.map((chapter, i) => (
          <div key={i} className="mb-16">
            <div className="relative w-full h-64 rounded-sm overflow-hidden mb-6">
              <Image
                src={chapter.image}
                alt={chapter.title}
                fill
                className="object-cover"
              />
            </div>

            <p className="font-mono text-xs tracking-widest text-[var(--primary)] mb-3">
              {chapter.label}
            </p>
            <h2 className="font-sekuya text-3xl leading-tight mb-4">
              {chapter.title}
            </h2>
            <p className="text-black/60 text-base leading-relaxed">
              {chapter.desc}
            </p>
          </div>
        ))}
      </section>

      <section
        ref={sectionRef}
        style={{ height: `${CHAPTERS.length * 100}vh` }}
        className="relative hidden md:block"
      >
        <div className="sticky top-0 h-screen flex overflow-hidden">
          <div className="w-1/2 flex flex-col justify-center px-16">
            <p className="font-mono text-xs tracking-widest text-[var(--primary)] mb-6">
              {CHAPTERS[active].label}
            </p>
            <h2
              key={`title-${active}`}
              className="font-sekuya text-5xl leading-tight mb-6 animate-fadeUp"
            >
              {CHAPTERS[active].title}
            </h2>
            <p
              key={`desc-${active}`}
              className="text-black/60 text-lg leading-relaxed max-w-sm animate-fadeUp"
            >
              {CHAPTERS[active].desc}
            </p>

            <div className="flex gap-2 mt-12">
              {CHAPTERS.map((_, i) => (
                <div
                  key={i}
                  className={`h-[2px] transition-all duration-500 ${
                    i === active ? "w-8 bg-[var(--primary)]" : "w-4 bg-black/20"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="w-1/2 relative">
            {CHAPTERS.map((chapter, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={chapter.image}
                  alt={chapter.title}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
