import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductGallery from "@/components/katalog/ProductGallery";
import AddToFavourite from "@/components/katalog/AddToFavourite";
import { isFavourited } from "@/lib/katalog/actions";
import { auth } from "@/lib/auth";
import NaruciProizvod from "@/components/katalog/NaruciProizvod";
import TrackVisit from "@/components/katalog/TrackVisit";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  const session = await auth();
  const userId = session?.user?.id;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true, colors: true },
  });

  if (!product) notFound();

  const initialFavourited = userId ? await isFavourited(product?.id) : false;

  const hasWhite = product.colors?.some((c) => c.color === "BIJELA");
  const hasBlack = product.colors?.some((c) => c.color === "CRNA");
  const hasWooden = product.colors?.some((c) => c.color === "DRVO");

  return (
    <div className="min-h-screen bg-[var(--foreground)] pt-16">
      <TrackVisit productId={product.id} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <nav className="mb-8 flex items-center gap-2 text-[11px] text-white/30 uppercase tracking-widest">
          <Link href="/katalog">KATALOG</Link>
          <span>/</span>
          <span className="text-white/60 truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-16 items-start">
          <div className="animate-fade-left">
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          <div className="flex flex-col gap-6 animate-fade-right">
            <div className="inline-flex">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--primary)] border border-[var(--primary)]/40 bg-[var(--primary)]/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold uppercase text-white leading-tight tracking-tight">
                {product.name}
              </h1>
              <p className="text-3xl text-[var(--primary)] font-semibold mt-3">
                {product.price} KM
              </p>
            </div>

            <div className="h-px bg-white/10 w-full" />

            <div>
              <p className="text-[11px] text-white/40 uppercase tracking-[0.18em] mb-3">
                Opis proizvoda
              </p>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base break-words whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            <div>
              <p className="text-[11px] text-white/40 uppercase tracking-[0.18em] mb-2">
                Vrsta drveta
              </p>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base break-words whitespace-pre-wrap lowercase first-letter:uppercase">
                {product.woodType}
              </p>
            </div>

            {(hasWhite || hasBlack || hasWooden) && (
              <div>
                <p className="text-[11px] text-white/40 uppercase tracking-[0.18em] mb-3">
                  Dostupne boje
                </p>
                <div className="flex gap-3">
                  {hasWhite && (
                    <div
                      className="w-7 h-7 rounded-full bg-white ring-1 ring-white/20 ring-offset-2 ring-offset-[var(--foreground)] hover:scale-110 transition-transform duration-200 cursor-pointer"
                      title="Bijela"
                    />
                  )}
                  {hasBlack && (
                    <div
                      className="w-7 h-7 rounded-full bg-black ring-1 ring-white/20 ring-offset-2 ring-offset-[var(--foreground)] hover:scale-110 transition-transform duration-200 cursor-pointer"
                      title="Crna"
                    />
                  )}
                  {hasWooden && (
                    <div
                      className="w-7 h-7 rounded-full bg-[#8B4513] ring-1 ring-white/20 ring-offset-2 ring-offset-[var(--foreground)] hover:scale-110 transition-transform duration-200 cursor-pointer"
                      title="Drvo"
                    />
                  )}
                </div>
              </div>
            )}

            {product.dimensions && (
              <div>
                <p className="text-[11px] text-white/40 uppercase tracking-[0.18em] mb-2">
                  Dimenzije
                </p>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base break-words whitespace-pre-wrap flex justify-between mb:flex-col">
                  {product.dimensions}{" "}
                  <span className="text-white/40 leading-relaxed sm:text-base break-words whitespace-pre-wrap">
                    {" "}
                    Dimenzije se mogu prilagoditi zelji kupaca!
                  </span>
                </p>
              </div>
            )}

            <div className="h-px bg-white/10 w-full" />

            <div className="flex gap-3">
              <NaruciProizvod
                productId={product.id}
                productName={product.name}
                availableColors={product.colors.map((c) => c.color)}
                dimensions={product.dimensions}
              />

              <AddToFavourite
                productId={product.id}
                initialFavourited={!!initialFavourited}
                userId={userId ?? null}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
