"use server";
import { Color } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {ipRatelimit} from "@/lib/ratelimit";

export async function createNarudzba(data: {
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  adresa: string;
  kanton: string;
  postanskiBroj: string;
  productId: string;
  boja: string;
  dimenzije: string;
  napomena?: string;
}) {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const { success } = await ipRatelimit.limit(`narudzba:${ip}`);
  if (!success) return { error: "Previše pokušaja. Pokušajte ponovo." };

  if (!data.ime?.trim() || !data.prezime?.trim())
    return { error: "Ime i prezime su obavezni." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return { error: "Nevažeći email." };
  if (!/^\+?[\d\s\-()]{6,20}$/.test(data.telefon))
    return { error: "Nevažeći telefon." };

  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });
  if (!product) return { error: "Proizvod ne postoji." };

  await prisma.narudzba.create({
    data: {
      ...data,
      boja: data.boja as Color,
    },
  });

  return { success: true };
}

export async function isFavourited(productId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = session.user.id;

  return prisma.favourite.findUnique({
    where: { userId_productId: { userId, productId } },
  });
}

export async function toggleFavourite(productId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Neovlašteno");
  const userId = session.user.id;
  const existing = await prisma.favourite.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (existing) {
    await prisma.favourite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favourite.create({ data: { userId, productId } });
  }

  revalidatePath("/favourites");
  revalidatePath(`/katalog/${productId}`);
}

export async function incrementVisitors(productId: string) {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const { success } = await ipRatelimit.limit(`visitors:${ip}`);
  if (!success) return;

  await prisma.product.update({
    where: { id: productId },
    data: { visitors: { increment: 1 } },
  });
}
