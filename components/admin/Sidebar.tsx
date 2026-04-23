"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import Add from "@/public/svg/add.svg";
import Dashboard from "@/public/svg/dashboard.svg";
import Sections from "@/public/svg/sections.svg";
import User from "@/public/svg/user.svg";
import Product from "@/public/svg/box.svg";
import Narudzba from "@/public/svg/narudzba.svg";
import Poruke from "@/public/svg/message.svg";

const navItems = [
  { name: "Nadzorna ploča", href: "/admin", icon: Dashboard },
  { name: "Korisnici", href: "/admin/users", icon: User },
  { name: "Dodaj proizvod", href: "/admin/add-product", icon: Add },
  { name: "Proizvodi", href: "/admin/products", icon: Product },
  { name: "Sekcije", href: "/admin/sections", icon: Sections },
  { name: "Narudzbe", href: "/admin/narudzbe", icon: Narudzba },
  { name: "Poruke", href: "/admin/messages", icon: Poruke },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full w-full flex-col">
      <div className="mb-6 text-lg font-semibold w-full bg-black/90 p-4">
        <p className="uppercase text-center font-bold text-white">
          Admin Panel
        </p>
      </div>

      <div className="flex flex-col gap-2 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`
                                flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition
                                ${
                                  isActive
                                    ? "bg-black text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }
                            `}
            >
              <Image
                src={item.icon}
                alt={item.name}
                width={24}
                height={24}
                className={`transition ${!isActive ? "invert" : ""}`}
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-4 text-xs text-gray-400">xtcelic v1.0</div>
    </nav>
  );
}
