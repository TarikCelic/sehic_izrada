import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import ProductCard from "@/components/katalog/ProductCard";

const getFavourites = unstable_cache(
  async (userId: string) => {
    return prisma.favourite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { take: 1 },
            colors: true,
          },
        },
      },
    });
  },
  ["user-favourites"],
  { revalidate: 30 },
);

export default async function FavouritesPage() {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const favourites = await getFavourites(session.user.id);

  return (
    <section className="min-h-[100dvh] w-full flex flex-col py-20 px-6 md:px-12 lg:px-12 overflow-x-hidden gap-8">
      <div className={"animate-fade-down"}>
        <p className="font-sekuya text-(--primary) text-4xl">
          Omiljeni proizvodi
        </p>
        <p>Svi sačuvani proizvodi na jednom mjestu ({favourites.length})</p>
      </div>

      <div className="rounded-lg w-full flex-1">
        {favourites.length === 0 ? (
          <p className="text-white/40">Nemate sačuvanih proizvoda.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 animate-fade-down">
            {favourites.map((fav) => {
              const colors = fav.product.colors || [];
              const hasWhite = colors.some((c) => c.color === "BIJELA");
              const hasBlack = colors.some((c) => c.color === "CRNA");
              const hasWooden = colors.some((c) => c.color === "DRVO");

              return (
                <ProductCard
                  key={fav.id}
                  product={fav.product}
                  hasWooden={hasWooden}
                  hasBlack={hasBlack}
                  hasWhite={hasWhite}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
