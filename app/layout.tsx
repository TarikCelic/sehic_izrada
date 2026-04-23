import type { Metadata } from "next";
import { Sekuya } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/home/Navigation";
import { Space_Grotesk } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { Toaster } from "sonner";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Šehić - Izrada namještaja",
  description:
    "Stolovi, police i namještaj od drveta i metala — rađen rukom, za generacije.",
};

const sekuya = Sekuya({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sekuya",
  weight: "400",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html className={`${spaceGrotesk.variable} ${sekuya.variable}`}>
      <body className={`${spaceGrotesk.className} relative`}>
        <SessionProvider session={session}>
          <Navigation />
          {children}

          <Toaster
            position="top-center"
            toastOptions={{
              classNames: {
                toast:
                  "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 rounded-xl px-5 py-4",

                title: "text-black font-medium text-sm",

                description: "text-gray-500 text-xs",

                icon: "text-black",

                success: "text-black",
                error: "text-black",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
