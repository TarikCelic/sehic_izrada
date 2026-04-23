"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Link from "next/link";
import Home from "@/public/svg/home.svg"
import Image from "next/image"

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setSidebarOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [sidebarOpen]);

    return (
        <div className="mt-16 flex h-[calc(100vh-4rem)]">

            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b justify-between border-gray-200 flex items-center px-4 gap-3">
                <button
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Otvori meni"
                    className="p-2 rounded-md text-black hover:bg-gray-100 transition"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <p className="font-bold text-sm uppercase tracking-widest">Admin Panel</p>
                <Link href={"/"}>
                    <Image src={Home} className={"w-6 h-6"} alt={"Home page"}/>
                </Link>
            </div>

            <aside className="hidden lg:flex w-64 shrink-0 border-r bg-white border-gray-200 h-full">
                <Sidebar />
            </aside>

            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`
                    lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <button
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Zatvori meni"
                    className="absolute top-4 right-4 p-1.5 rounded-md text-white hover:bg-white/20 transition z-10"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </aside>

            <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-50 min-w-0">
                {children}
            </main>
        </div>
    );
}
