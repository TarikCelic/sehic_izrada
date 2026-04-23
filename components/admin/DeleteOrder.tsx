"use client"
import Image from "next/image"

import { deleteOrder } from "@/lib/admin/actions";
import DeleteIcon from "@/public/svg/delete.svg";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export default function DeleteProductButton({ id }: { id: string }) {

    const router = useRouter();
    const handleDelete = async () => {
        const potvrda = confirm("Da li ste sigurni da želite obrisati ovu narudzbu?");

        if (potvrda) {

            const result = async () => {
                const res = await deleteOrder(id);
                if (res?.error) throw new Error(res.error);
            }

            toast.promise(result(),{
                loading: "Brisanje narudzbe...",
                success: () => {
                    router.refresh();
                    return "Narudzba je uspjesno obrisana!"
                },
                error: (err) => err.message || "Greška pri brisanju."
            })

        }
    };

    return (
        <button
            onClick={handleDelete}
            className="w-6 h-6 opacity-70 hover:opacity-50 hover:text-red-500 transition-all cursor-pointer "
        >
            <Image src={DeleteIcon} alt="delete" />
        </button>
    );
}