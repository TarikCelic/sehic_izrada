import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "Korisnik" | "Moderator" | "Vlasnik" | "Programer";
  }

  interface Session {
    user: {
      id: string;
      role: "Korisnik" | "Moderator" | "Vlasnik" | "Programer";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "Korisnik" | "Moderator" | "Vlasnik" | "Programer";
  }
}
