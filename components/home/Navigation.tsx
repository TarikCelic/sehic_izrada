"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Image from "next/image";
import Favourites from "@/public/svg/favourites.svg";
import Search from "@/public/svg/search.svg";
import { usePathname } from "next/navigation";
import SearchInput from "@/components/SearchInput";
import GoToProfile from "../account/GoToProfile";
import User from "@/public/svg/user.svg";

const NAV_LINKS = [
  { label: "Katalog", href: "/katalog" },
  { label: "O nama", href: "/about" },
  { label: "Kontakt", href: "/kontakt" },
];

export default function Navigation() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isAdmin = pathname.startsWith("/admin");
  const isKatalog = pathname.startsWith("/katalog");
  const isOBP =
    pathname.startsWith("/about") || pathname.startsWith("/kontakt");
  const doWhite =
    pathname.startsWith("/register") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/favourites");

  const toggleSearch = () => setSearchActive((prev) => !prev);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const getThreshold = () => {
      const w = window.innerWidth;
      if (w < 768) return 750;
      if (w < 1024) return 600;
      return 950;
    };

    const handler = () => setScrolled(window.scrollY > getThreshold());
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileOpen]);

  const toggleMenu = useCallback(() => setIsMobileOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsMobileOpen(false), []);

  const isLightMode = isAdmin || doWhite || (scrolled && !isKatalog);

  const getNavbarBg = () => {
    if (isAdmin) return "bg-white border-b border-gray-200";
    if (isKatalog) return "bg-[var(--foreground)] border-b border-black/30";
    if (scrolled && !isKatalog && isOBP) return "bg-[#ffffffaf] invert  ";
    if (scrolled && isKatalog) return "bg-[#000000af] backdrop-blur-lg invert";
    return "bg-transparent backdrop-blur-sm";
  };

  return (
    <>
      <SearchInput
        isOpen={searchActive}
        onClose={() => setSearchActive(false)}
      />
      <nav
        className={`px-8 py-4 flex items-center fixed top-0 z-40 w-full transition-all duration-300
                ${getNavbarBg()} 
                ${isMobileOpen ? "pointer-events-none" : "pointer-events-auto"}`}
      >
        <Link
          href={"/public"}
          className={`transition-all duration-700 will-change-transform ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          } ${!isLightMode && !isMobileOpen ? "invert" : ""}`}
        >
          <Logo />
        </Link>

        <ul className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-2">
          {NAV_LINKS.map((item, idx) => (
            <li
              key={item.href}
              style={{
                transitionProperty: "opacity, transform",
                transitionDuration: "700ms",
                transitionDelay: isMounted ? `${idx * 50}ms` : "0ms",
                opacity: isMounted ? 1 : 0,
                transform: isMounted ? "translateY(0)" : "translateY(-16px)",
              }}
            >
              <Link
                href={item.href}
                className={`text-center block w-16 text-[0.95rem] font-medium transition-all duration-300 relative
                                after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px]
                                after:transition-all after:duration-300 hover:after:w-full
                                ${
                                  isLightMode
                                    ? "text-black hover:text-[var(--primary)] after:bg-[var(--primary)]"
                                    : "text-white hover:text-white/70 after:bg-white"
                                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div
          className="hidden md:flex ml-auto items-center gap-4 will-change-transform transition-all duration-700"
          style={{
            opacity: isMounted ? 1 : 0,
            transform: isMounted ? "translateY(0)" : "translateY(-16px)",
            transitionDelay: isMounted ? "150ms" : "0ms",
          }}
        >
          <Image
            src={Search}
            onClick={toggleSearch}
            alt="Search Icon"
            className={`w-7 transition-all duration-300 cursor-pointer ${!isLightMode ? "invert" : ""}`}
          />
          <Link href="/favourites">
            <Image
              src={Favourites}
              alt="Favourites"
              className={`w-7 transition-all duration-300 ${!isLightMode ? "invert" : ""}`}
            />
          </Link>
          <GoToProfile isLightMode={isLightMode} />
        </div>

        <button
          onClick={toggleMenu}
          aria-label={isMobileOpen ? "Zatvori navigaciju" : "Otvori navigaciju"}
          className="md:hidden ml-auto relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 z-50"
        >
          <span
            className={`w-6 h-0.5 rounded-full transition-all duration-300 ease-in-out ${
              isMobileOpen
                ? "rotate-45 translate-y-2 bg-black"
                : isLightMode
                  ? "bg-black"
                  : "bg-white"
            }`}
          />
          <span
            className={`w-6 h-0.5 rounded-full transition-all duration-300 ease-in-out ${
              isMobileOpen
                ? "opacity-0 scale-0"
                : isLightMode
                  ? "bg-black"
                  : "bg-white"
            }`}
          />
          <span
            className={`w-6 h-0.5 rounded-full transition-all duration-300 ease-in-out ${
              isMobileOpen
                ? "-rotate-45 -translate-y-2 bg-black"
                : isLightMode
                  ? "bg-black"
                  : "bg-white"
            }`}
          />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-400 md:hidden ${
          isMobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-4/5 max-w-xs z-50 bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-6 px-6 pb-8">
          <div className="flex items-center justify-between mb-8">
            <Logo />
            <button
              onClick={closeMenu}
              className="w-9 h-9 rounded-full text-gray-700 flex items-center justify-center hover:bg-gray-200"
            >
              <span className="text-4xl leading-none">×</span>
            </button>
          </div>

          <nav className="flex flex-col gap-6 flex-1">
            {NAV_LINKS.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="text-xl font-medium text-gray-900 hover:text-[var(--primary)] transition-colors duration-200"
                style={{
                  transitionProperty: "opacity, transform",
                  transitionDuration: "400ms",
                  transitionDelay: `${isMobileOpen ? i * 75 : 0}ms`,
                  opacity: isMobileOpen ? 1 : 0,
                  transform: isMobileOpen
                    ? "translateX(0)"
                    : "translateX(20px)",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-gray-200 pt-6 space-y-4">
            <button
              onClick={() => {
                closeMenu();
                toggleSearch();
              }}
              className="flex items-center gap-3 text-gray-700 hover:text-[var(--primary)] w-full cursor-pointer"
            >
              <Image src={Search} alt="Favourites" className="w-5" />
              <span className="text-sm font-medium">Pretraga</span>
            </button>
            <Link
              href="/favourites"
              onClick={closeMenu}
              className="flex items-center gap-3 text-gray-700 hover:text-[var(--primary)]"
            >
              <Image src={Favourites} alt="Favourites" className="w-5" />
              <span className="text-sm font-medium">Omiljeni proizvodi</span>
            </Link>
            <Link
              href="/account"
              onClick={closeMenu}
              className="flex items-center gap-3 text-gray-700 hover:text-[var(--primary)]"
            >
              <Image src={User} alt="Favourites" className="w-5 invert" />
              <span className="text-sm font-medium">Korisnicki nalog</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
