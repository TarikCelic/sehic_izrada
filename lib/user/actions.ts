"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth, signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import bcryptjs from "bcryptjs";
import { revalidatePath } from "next/cache";
import { ROLE } from "@prisma/client";
import { ipRatelimit, loginRatelimit } from "@/lib/ratelimit";

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function updateUserRole(userId: string, role: ROLE) {
  const session = await auth();

  if (
    !session?.user?.role ||
    !["Vlasnik", "Programer"].includes(session.user.role)
  )
    throw new Error("Neovlašteno");

  if (role === "Vlasnik" && session.user.role !== "Vlasnik")
    throw new Error("Neovlašteno");

  if (userId === session.user.id)
    throw new Error("Ne možeš mijenjati svoju vlastitu rolu");

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
}

export async function deleteAccount(id: string) {
  const session = await auth();
  if (
    !session?.user?.role ||
    !["Vlasnik", "Programer"].includes(session.user.role)
  ) {
    throw new Error("Neovlašteno");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return { error: "Korisnik nije pronađen." };

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Greška pri brisanju:", error);
    return { error: "Došlo je do greške prilikom brisanja korisnika." };
  }
}

export async function updateProfile(data: {
  name: string;
  email: string;
  newPassword: string;
  currentPassword: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Nisi prijavljen" };

  const { success } = await loginRatelimit.limit(`profile:${session.user.id}`);
  if (!success)
    return { error: "Previše pokušaja. Pokušajte ponovo za 15 minuta." };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "Korisnik nije pronađen" };

  const passwordMatch = await bcryptjs.compare(
    data.currentPassword,
    user.password,
  );
  if (!passwordMatch) return { error: "Pogrešna trenutna lozinka" };
  if (!validateEmail(data.email)) return { error: "Nevažeća email adresa." };
  const updateData: { name?: string; email?: string; password?: string } = {};

  if (data.name !== user.name) updateData.name = data.name;
  if (data.email !== user.email) updateData.email = data.email;
  if (data.newPassword)
    updateData.password = await bcryptjs.hash(data.newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
  });

  revalidatePath("/account");
  revalidatePath("/admin/users");
  return { success: true };
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
) {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";

  const [byEmail, byIp] = await Promise.all([
    loginRatelimit.limit(`login:${email}`),
    ipRatelimit.limit(`login:ip:${ip}`),
  ]);

  if (!byEmail.success || !byIp.success)
    return { error: "Previše pokušaja. Pokušajte ponovo za 15 minuta." };

  if (!name || !email || !password)
    return { error: "Morate popuniti sva polja." };
  if (name.length < 3) return { error: "Ime mora imati najmanje 3 karaktera." };
  if (!validateEmail(email)) return { error: "Nevažeća email adresa." };
  if (password.length < 6)
    return { error: "Lozinka mora imati najmanje 6 karaktera." };

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return { error: "Korisnik sa ovim email-om već postoji." };

    const hashedPw = await bcryptjs.hash(password, 12);
    await prisma.user.create({ data: { name, email, password: hashedPw } });

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    console.error("Greška pri registraciji:", error);
    return { error: "Došlo je do greške pri registraciji. Pokušajte ponovo." };
  }
}

export async function loginUser(email: string, password: string) {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";

  const [byEmail, byIp] = await Promise.all([
    loginRatelimit.limit(`login:${email}`),
    ipRatelimit.limit(`login:ip:${ip}`),
  ]);

  if (!byEmail.success || !byIp.success)
    return { error: "Previše pokušaja. Pokušajte ponovo za 15 minuta." };

  if (!email || !password) return { error: "Morate popuniti sva polja." };
  if (!validateEmail(email)) return { error: "Nevažeća email adresa." };

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Netačna email adresa ili lozinka." };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Netačna email adresa ili lozinka." };
        default:
          return { error: "Došlo je do greške prilikom prijavljivanja." };
      }
    }
    throw error;
  }
}
