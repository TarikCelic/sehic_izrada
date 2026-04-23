"use client"
import { useState, useEffect } from "react";
import { registerUser } from "@/lib/user/actions"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Logo from "@/public/svg/logo/cube.svg";
import Link from "next/link";
import {toast} from "sonner";

const Page = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session) router.push("/account");
    }, [session, router]);

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const registerPromise = async () => {
            const user = await registerUser(email, password, name);
            if (user?.error) throw new Error(user.error);
            return user;
        };

        toast.promise(registerPromise(), {
            loading: 'Kreiranje računa...',
            success: () => {
                window.location.href = "/account";
                return "Račun uspješno kreiran!";
            },
            error: (err) => {
                setLoading(false);
                return err.message || "Došlo je do greške pri registraciji.";
            },
        });
    }

    if (session) {
        return (
            <div className="mt-16 flex h-[calc(100vh-4rem)] justify-center items-center">
                <p className="text-gray-500 text-sm">Redirekcija...</p>
            </div>
        )
    }

    return (
        <div className="mt-16 flex min-h-[calc(100vh-4rem)] justify-center items-center px-4 py-8">
            <div className="w-full max-w-sm flex flex-col gap-2 justify-center items-center rounded-xl shadow-md px-6 py-8 animate-fade-down bg-white">
                <div className="flex flex-col justify-center items-center">
                    <Image src={Logo} alt="logo" className="w-10" />
                    <p className="text-2xl mt-4 font-medium">Dobrodošli</p>
                    <p className="text-sm text-gray-500 text-center mt-1">Registrujte svoj nalog kako bi nastavili.</p>
                </div>

                <form onSubmit={handleRegister} className="flex flex-col items-center gap-3 pt-4 w-full">
                    <input
                        value={name}
                        type="text"
                        placeholder="Ime"
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black/20 transition text-sm"
                    />
                    <input
                        value={email}
                        type="email"
                        placeholder="E-Mail"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black/20 transition text-sm"
                    />
                    <input
                        value={password}
                        type="password"
                        placeholder="Lozinka"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black/20 transition text-sm"
                    />
                    <input
                        disabled={loading}
                        type="submit"
                        className={`${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-transparent hover:text-(--primary)'} bg-(--primary) w-full px-3 py-3 text-white mt-2 rounded-sm transition duration-250 border border-(--primary) text-sm`}
                        value="Registruj se"
                    />
                </form>

                <p className="text-sm text-gray-500 mt-1">
                    Imate kreiran račun?{" "}
                    <Link className="text-(--primary) underline" href="/login">Prijavite se</Link>
                </p>
            </div>
        </div>
    )
}

export default Page