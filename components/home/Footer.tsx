"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { label: "Katalog", href: "/katalog" },
  { label: "O nama", href: "/about" },
  { label: "Kontakt", href: "/kontakt" },
];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/senaid.sehic/" },
  { label: "Facebook", href: "https://www.facebook.com/senaid.sehic.604178" },
  { label: "TikTok", href: "https://tiktok.com/sehic-izrada" },
];

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
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

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative bg-black overflow-hidden pt-12 md:pt-20"
    >
      <div className="absolute bottom-8 left-0 right-0 flex items-end justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-sekuya text-[20vw] leading-none text-white/5 whitespace-nowrap">
          Šehić
        </span>
      </div>

      <div className="relative z-10 px-6 sm:px-10 lg:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 pb-12 md:pb-16 border-b border-white/5">
        <div
          className={`sm:col-span-2 will-change-transform transition-all duration-700 ${
            isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="transition-all duration-300 invert">
              <Logo />
            </div>
            <p className="font-sekuya text-2xl md:text-3xl text-white">
              Šehić Izrada
            </p>
          </div>
          <p className="mt-4 text-white/40 text-sm leading-relaxed max-w-xs">
            Pravimo namještaj od drveta i metala od 2012. godine. Svaki komad je
            jedinstven — rađen rukom, za generacije.
          </p>
        </div>

        <div
          className={`will-change-transform transition-all duration-700 ${
            isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
          style={{
            transitionDelay: isInView ? "50ms" : "0ms",
          }}
        >
          <p className="font-mono text-xs tracking-widest text-[var(--primary)] mb-5 md:mb-6">
            NAVIGACIJA
          </p>
          <ul className="flex flex-col gap-3">
            {LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-white/50 text-sm hover:text-white transition-colors duration-300 font-mono tracking-wide"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`will-change-transform transition-all duration-700 ${
            isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
          style={{
            transitionDelay: isInView ? "100ms" : "0ms",
          }}
        >
          <p className="font-mono text-xs tracking-widest text-[var(--primary)] mb-5 md:mb-6">
            KONTAKT
          </p>
          <ul className="flex flex-col gap-3 mb-8">
            <li className="text-white/50 text-sm font-mono">
              Gornji Vakuf - Uskoplje, BiH
            </li>
            <li className="text-white/50 text-sm font-mono">info@firma.ba</li>
            <li className="text-white/50 text-sm font-mono">+387 61 000 000</li>
          </ul>
          <p className="font-mono text-xs tracking-widest text-[var(--primary)] mb-4">
            PRATITE NAS
          </p>
          <ul className="flex gap-4">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <Link
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs tracking-widest text-white/40 hover:text-[var(--primary)] transition-colors duration-300"
                >
                  {s.label.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`relative z-10 px-6 sm:px-10 lg:px-16 py-5 md:py-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 will-change-transform transition-all duration-700 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{
          transitionDelay: isInView ? "150ms" : "0ms",
        }}
      >
        <p className="font-mono text-xs text-white/20 tracking-wide text-center sm:text-left">
          {`© ${new Date().getFullYear()} Šehić Izrada. Sva prava zadržana.`}
        </p>
        <p className="font-mono text-xs text-white/20 tracking-wide">
          made by Tarik Celic
        </p>
      </div>
    </footer>
  );
}
