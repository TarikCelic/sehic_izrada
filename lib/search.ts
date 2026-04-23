"use server";
import { prisma } from "@/lib/prisma";

const COLOR_MAP: Record<string, "BIJELA" | "CRNA" | "DRVO"> = {
  bijela: "BIJELA",
  bijel: "BIJELA",
  crna: "CRNA",
  crn: "CRNA",
  drvo: "DRVO",
  drven: "DRVO",
};

export async function searchProducts(searchTerm: string) {
  if (!searchTerm || searchTerm.trim() === "") return [];

  const normalized = searchTerm.toLowerCase().trim();
  const colorEnum = COLOR_MAP[normalized];

  try {
    return await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          ...(colorEnum ? [{ colors: { some: { color: colorEnum } } }] : []),
        ],
      },
      select: {
        id: true,
        name: true,
        price: true,
        colors: { select: { color: true } },
        images: { take: 1, select: { url: true } },
      },
      take: 10,
    });
  } catch (error) {
    console.error("Greška pri pretrazi proizvoda:", error);
    throw new Error("Nije moguće izvršiti pretragu.");
  }
}
