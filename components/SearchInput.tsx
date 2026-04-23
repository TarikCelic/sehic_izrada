"use client";

import { useEffect, useRef, useState } from "react";
import { searchProducts } from "@/lib/search";
import Image from "next/image";
import SearchIcon from "@/public/svg/search.svg";
import Link from "next/link";

type SearchResult = {
  id: string;
  name: string;
  price: number;
  colors: { color: "BIJELA" | "CRNA" | "DRVO" }[];
  images: { url: string }[];
};

const SkeletonCard = () => (
  <div className="flex flex-col gap-3 p-3 border border-black/5 animate-pulse">
    <div className="w-full h-75 bg-gray-100 rounded-sm" />
    <div className="h-5 bg-gray-200 w-3/4 rounded-sm" />
    <div className="h-4 bg-gray-100 w-1/3 rounded-sm" />
  </div>
);

const SearchInput = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setStatus("idle");
      return;
    }
    setStatus("loading");

    const timeout = setTimeout(async () => {
      try {
        const data = await searchProducts(query);
        setResults(data as SearchResult[]);
        setStatus("done");
      } catch (error) {
        console.error("Greška pri pretrazi:", error);
        setStatus("done");
      }
    }, 150);

    return () => clearTimeout(timeout);
  }, [query]);

  const showSkeletons = status === "loading";
  const showEmpty =
    status === "done" && query.length >= 2 && results.length === 0;
  const showResults = status === "done" && results.length > 0;

  return (
    <div
      ref={containerRef}
      className={`p-4 fixed top-0 w-full left-0 z-[100] bg-white flex flex-col px-6 lg:px-22 py-10 shadow-lg transition-all duration-300 ${
        isOpen
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className={"flex items-center gap-4"}>
        <div className="border border-black/20 flex gap-3 w-full p-4 items-center focus-within:border-(--primary) transition-colors duration-200">
          <Image
            src={SearchIcon}
            alt="search"
            className={`w-6 h-6 transition-opacity duration-200 ${status === "loading" ? "opacity-100" : "opacity-40"}`}
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pretraži proizvode (npr. stol, bijela, crna...)"
            type="text"
            className="block w-full outline-none text-lg"
          />

          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setStatus("idle");
            }}
            className={`text-gray-400 hover:text-black transition-all duration-200 text-xl leading-none ${query ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            aria-label="Obriši pretragu"
          >
            ×
          </button>
        </div>

        <div
          onClick={onClose}
          className={
            "flex justify-center items-center p-4 w-15 h-15 text-2xl font-mono cursor-pointer hover:border-[#FFFFFFAA] hover:bg-(--primary) hover:text-white transition-all duration-200 border border-black/20"
          }
        >
          X
        </div>
      </div>

      <div className="h-6 mt-2 flex items-center">
        {status === "loading" && (
          <p className="text-xs text-gray-400 animate-pulse">
            Pretraživanje u tijeku...
          </p>
        )}
        {showResults && (
          <p className="text-xs text-gray-400">
            {results.length} {results.length === 1 ? "rezultat" : "rezultata"}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 overflow-y-auto max-h-[70vh] pt-4">
        {showSkeletons &&
          Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}

        {showResults &&
          results.map((e, i) => (
            <Link
              onClick={onClose}
              href={`/katalog/${e.id}`}
              key={e.id}
              className="group border border-black/10 hover:border-black/30 hover:shadow-md animate-fade-down flex gap-3 flex-col p-3 transition-all duration-200"
              style={{
                animation: `fadeSlideIn 0.2s ease both`,
                animationDelay: `${i * 40}ms`,
              }}
            >
              <div className="w-full relative h-75 overflow-hidden">
                <Image
                  src={e.images[0].url}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  fill
                  alt={e.name}
                />
              </div>
              <div>
                <p className="text-lg font-bold truncate">{e.name}</p>
                <p className="text-gray-600 font-medium">
                  {e.price.toLocaleString()} KM
                </p>
              </div>
            </Link>
          ))}

        {showEmpty && (
          <p className="col-span-full text-center py-10 text-gray-500">
            Nismo pronašli ništa za{" "}
            <span className="font-medium">"{query}"</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
