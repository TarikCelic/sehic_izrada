"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { number: "6+", label: "Godina iskustva" },
  { number: "200+", label: "Zadovoljnih kupaca" },
  { number: "100%", label: "Ručna izrada" },
  { number: "48h", label: "Dostava" },
];

const extractNumber = (str: string): number => {
  return parseInt(str.replace(/\D/g, ""), 10);
};

const extractSuffix = (str: string): string => {
  return str.replace(/\d/g, "");
};

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [displayNumbers, setDisplayNumbers] = useState<{
    [key: string]: number;
  }>({});
  const hasCountedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasCountedRef.current) {
          hasCountedRef.current = true;

          const initialNumbers: { [key: string]: number } = {};
          STATS.forEach((stat) => {
            initialNumbers[stat.label] = 0;
          });
          setDisplayNumbers(initialNumbers);

          const duration = 1500;
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const newNumbers: { [key: string]: number } = {};
            STATS.forEach((stat) => {
              const targetNumber = extractNumber(stat.number);
              const easeOutQuad = 1 - Math.pow(1 - progress, 2);
              newNumbers[stat.label] = Math.floor(targetNumber * easeOutQuad);
            });

            setDisplayNumbers(newNumbers);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-y border-[#a3a3a32a] py-8 md:py-10"
    >
      <div className="grid grid-cols-2 md:flex md:justify-center md:items-center md:divide-x md:divide-[#a3a3a32a]">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center px-8 sm:px-12 md:px-16 py-6 md:py-0 gap-1
              ${i % 2 === 0 ? "border-r" : ""} border-[#a3a3a32a]
              ${i < 2 ? "border-b" : ""} md:border-b-0 md:border-r-0`}
          >
            <span className="font-sekuya text-3xl sm:text-4xl text-[var(--primary)] min-w-[60px] text-center">
              {displayNumbers[stat.label] !== undefined
                ? `${displayNumbers[stat.label]}${extractSuffix(stat.number)}`
                : stat.number}
            </span>
            <span className="font-mono text-[0.65rem] sm:text-xs tracking-widest uppercase text-black/50 text-center">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
