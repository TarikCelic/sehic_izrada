import ProductFilters from "@/components/katalog/SideBar";
import { prisma } from "@/lib/prisma";
import { Category, WoodType, Color, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import ProductCard from "@/components/katalog/ProductCard";
import TrackVisit from "@/components/katalog/TrackVisit";

interface PageProps {
  searchParams: Promise<{
    categories?: string;
    woodTypes?: string;
    colors?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
  }>;
}

const getProducts = unstable_cache(
  async (
    where: Prisma.ProductWhereInput,
    orderBy: Prisma.ProductOrderByWithRelationInput,
  ) => {
    return prisma.product.findMany({
      where,
      include: { images: { take: 1 }, colors: true },
      orderBy,
    });
  },
  ["katalog-products"],
  { revalidate: 30 },
);

export default async function KatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const categories = params.categories
    ? (params.categories.split(",").filter(Boolean) as Category[])
    : [];
  const woodTypes = params.woodTypes
    ? (params.woodTypes.split(",").filter(Boolean) as WoodType[])
    : [];
  const colors = params.colors
    ? (params.colors.split(",").filter(Boolean) as Color[])
    : [];
  const minPrice = params.minPrice ? Number(params.minPrice) : 0;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : 999999;
  const sortBy = params.sortBy ?? "newest";

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sortBy === "price_asc"
      ? { price: "asc" }
      : sortBy === "price_desc"
        ? { price: "desc" }
        : sortBy === "popular"
          ? { visitors: "desc" }
          : { createdAt: "desc" };

  const where: Prisma.ProductWhereInput = {
    ...(categories.length > 0 && { category: { in: categories } }),
    ...(woodTypes.length > 0 && { woodType: { in: woodTypes } }),
    ...(colors.length > 0 && { colors: { some: { color: { in: colors } } } }),
    price: { gte: minPrice, lte: maxPrice },
  };

  const products = await getProducts(where, orderBy);

  return (
    <div className="mt-16 flex h-[calc(100vh-4rem)] bg-[var(--foreground)]">
      <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-white/8 flex-col animate-fade-left">
        <Suspense fallback={null}>
          <ProductFilters />
        </Suspense>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-end justify-between px-4 sm:px-6 pt-6 pb-5 border-b border-white/8 gap-4 flex-wrap">
          <div>
            <p className="font-sekuya text-[var(--primary)] text-4xl sm:text-5xl uppercase tracking-tight leading-none">
              KATALOG
            </p>
            <p className="text-white/35 text-sm mt-1.5">
              {products.length === 0
                ? "Nema rezultata za odabrane filtere"
                : `${products.length} ${products.length === 1 ? "proizvod" : "proizvoda"}`}
            </p>
          </div>

          <div className="lg:hidden">
            <Suspense fallback={null}>
              <ProductFilters />
            </Suspense>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-white/20">
              <svg
                className="w-14 h-14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-sm font-medium">
                Pokušaj s drugačijim filterima
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 animate-fade-down">
              {products.map((product) => {
                const hasWhite = product.colors?.some(
                  (c) => c.color === "BIJELA",
                );
                const hasBlack = product.colors?.some(
                  (c) => c.color === "CRNA",
                );
                const hasWooden = product.colors?.some(
                  (c) => c.color === "DRVO",
                );

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    hasWooden={hasWooden}
                    hasBlack={hasBlack}
                    hasWhite={hasWhite}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
