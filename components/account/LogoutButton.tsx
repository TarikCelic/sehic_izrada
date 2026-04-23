'use client'
import { toast } from "sonner"
import {signOut} from "next-auth/react";

export default function LogoutButton() {
    async function handleLogout() {
        toast.success("Uspješno ste se odjavili!");
        await signOut({
            callbackUrl: "/",
            redirect: true
        });
    }

    return (
        <button
            onClick={handleLogout}
            className="rounded-md border border-gray-300 cursor-pointer py-2 px-4 hover:bg-gray-100 transition-colors text-sm"
        >
            Odjavi se
        </button>
    )
}