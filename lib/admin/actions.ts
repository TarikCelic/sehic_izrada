'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import {Category, Color, NarudzbaStatus, WoodType} from "@prisma/client"
import {del} from "@vercel/blob";
import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";

export async function updateOrderStatus(orderId: string, status: string) {

    const session = await auth();
    if (!session?.user?.role || !["Vlasnik", "Programer", "Moderator"].includes(session.user.role)) {
        throw new Error("Neovlašteno");
    }

    if (!Object.values(NarudzbaStatus).includes(status as NarudzbaStatus)) {
        throw new Error("Nevalidan status")
    }

    await prisma.narudzba.update({
        where: { id: orderId },
        data: { status: status as NarudzbaStatus },
    })

    revalidatePath("/admin/narudzbe")
}

export async function deleteProduct(id: string) {
    const session = await auth();
    if (!session?.user?.role || !["Vlasnik", "Programer", "Moderator"].includes(session.user.role)) {
        throw new Error("Neovlašteno");
    }
    try {
        const product = await prisma.product.findUnique({
            where: {id},
            include: {images: true},
        });

        if (!product) return {error: "Proizvod nije pronađen."};

        const urlsToDelete = product.images.map(img => img.url);
        if (urlsToDelete.length > 0) await del(urlsToDelete);

        await prisma.product.delete({where: {id}});

        revalidatePath("/admin/products");
        revalidatePath("/katalog");
        return {success: true};
    } catch (error) {
        console.error("Greška pri brisanju:", error);
        return {error: "Došlo je do greške prilikom brisanja proizvoda."};
    }
}

export async function createProduct(formData: FormData) {
    const session = await auth();
    if (!session?.user?.role || !["Vlasnik", "Programer", "Moderator"].includes(session.user.role)) {
        throw new Error("Neovlašteno");
    }
    const ime      = formData.get("ime")?.toString().trim()      || "";
    const opis     = formData.get("opis")?.toString().trim()     || "";
    const category = formData.get("category")?.toString()        || "";
    const woodType = formData.get("woodType")?.toString()        || "";
    const dimenzije = formData.get("dimenzije")?.toString().trim() || "";
    const cijenaRaw = formData.get("cijena")?.toString()         || "0";
    const bojeRaw  = formData.get("boje")?.toString()            || "[]";

    if (!ime || !opis || !dimenzije) return { error: "Sva polja moraju biti popunjena!" };

    const imageUrlsRaw = formData.get("imageUrls")?.toString();
    let savedPicsUrls: string[] = [];

    if (imageUrlsRaw) {
        try {
            savedPicsUrls = JSON.parse(imageUrlsRaw);
        } catch (e) {
            console.error("Greška pri parsiranju URL-ova slika", e);
        }
    }

    if (savedPicsUrls.length < 1) return { error: "Morate dodati bar jednu sliku!" };

    const selektovaneBoje: Color[] = JSON.parse(bojeRaw);

    try {
        await prisma.product.create({
            data: {
                visitors: 0,
                name: ime,
                description: opis,
                category: category as Category,
                woodType: woodType as WoodType,
                dimensions: dimenzije,
                price: Number(cijenaRaw),
                colors: { create: selektovaneBoje.map((color) => ({ color })) },
                images: { create: savedPicsUrls.map((url: string) => ({ url })) }
            }
        });

        revalidatePath("/admin");
        revalidatePath("/katalog");
        return { success: true }
    } catch (error) {
        console.error(error);
        return { error: "Greška pri dodavanju proizvoda u bazu!" };
    }
}

export async function deleteOrder(id: string) {
    const session = await auth();
    if (!session?.user?.role || !["Vlasnik", "Programer", "Moderator"].includes(session.user.role)) {
        throw new Error("Neovlašteno");
    }
    try {
        const narudzba = await prisma.narudzba.findUnique({
            where: { id },
        });

        if (!narudzba) return { error: "Proizvod nije pronađen." };

        await prisma.narudzba.delete({ where: { id } });

        revalidatePath("/admin/narudzbe");
        return { success: true };
    } catch (error) {
        console.error("Greška pri brisanju:", error);
        return { error: "Došlo je do greške prilikom brisanja narudzbe." };
    }
}
export async function updateProduct(id: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.role || !["Vlasnik", "Programer", "Moderator"].includes(session.user.role)) {
        throw new Error("Neovlašteno");
    }
    const ime       = formData.get("ime")?.toString().trim()       || "";
    const opis      = formData.get("opis")?.toString().trim()      || "";
    const category  = formData.get("category")?.toString()         || "";
    const woodType  = formData.get("woodType")?.toString()         || "";
    const dimenzije = formData.get("dimenzije")?.toString().trim() || "";
    const cijenaRaw = formData.get("cijena")?.toString()           || "0";
    const bojeRaw   = formData.get("boje")?.toString()             || "[]";
    const isFeatured = formData.get("isFeatured") === "true";

    if (!ime || !opis || !dimenzije) return { error: "Sva polja moraju biti popunjena!" };

    const selektovaneBoje: Color[] = JSON.parse(bojeRaw);

    try {

        await prisma.productColor.deleteMany({ where: { productId: id } });

        await prisma.product.update({
            where: { id },
            data: {
                name: ime,
                description: opis,
                category: category as Category,
                woodType: woodType as WoodType,
                dimensions: dimenzije,
                price: Number(cijenaRaw),
                isFeatured,
                colors: {
                    create: selektovaneBoje.map((color) => ({ color }))
                }
            }
        });
    } catch (error) {
        console.error(error);
        return { error: "Greška pri ažuriranju proizvoda!" };
    }

    revalidatePath("/admin/products");
    revalidatePath("/katalog");
    return { success: true };
}

export async function deleteMessage(id: string) {
    const session = await auth();
    if (!session?.user?.role || !["Vlasnik", "Programer", "Moderator"].includes(session.user.role)) {
        throw new Error("Neovlašteno");
    }
    try {
        await prisma.contactMessage.delete({ where: { id } })
    } catch {
        return { error: true }
    }
}

export async function createMessage(formData: FormData) {
    const name = formData.get("ime") as string;
    const email = formData.get("email") as string;
    const poruka = formData.get("poruka") as string;

    if (!name || !email || !poruka) return { error: "Sva polja moraju biti popunjena!" };

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) return { error: "Nevažeća email adresa." };

    try {
        await prisma.contactMessage.create(
            {
                data: {
                    name,
                    email,
                    poruka,
                }
            }
        );
    } catch (error) {
        console.error(error);
        return { error: "Greška pri slanju poruke!" };
    }

    revalidatePath("/admin/products");
    revalidatePath("/katalog");
    return { success: true };
}