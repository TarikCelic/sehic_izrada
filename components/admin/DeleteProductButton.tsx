"use client"
import Image from "next/image"

import { deleteProduct } from "@/lib/admin/actions";
import DeleteIcon from "@/public/svg/delete.svg";
import { useRouter } from "next/navigation"
import {toast} from "sonner";

export default function DeleteProductButton({ id }: { id: string }) {
    const router = useRouter();
    const handleDelete = async () => {
        const potvrda = confirm("Da li ste sigurni da želite obrisati ovaj proizvod?");

        if (potvrda) {
            const finishIt = async () =>{
                const res = await deleteProduct(id);
                if (res?.error) {
                    toast.warning(res.error);
                }
            }

            toast.promise(finishIt,{
                loading: "Brisanje proizvoda...",
                success: () => {
                    router.refresh();
                    return "Proizvod je uspjesno obrisan!";
                },
                error: (err) => {
                    return err.message || "Greška pri brisanju.";
                }
            })
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="w-5 h-5 opacity-70 hover:opacity-50 hover:text-red-500 transition-all cursor-pointer "
        >
            <Image src={DeleteIcon} alt="delete" />
        </button>
    );
}