"use client";
import Image from "next/image";

import { deleteAccount } from "@/lib/user/actions";
import DeleteIcon from "@/public/svg/delete.svg";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const handleDelete = async () => {
    const potvrda = confirm("Da li ste sigurni da želite obrisati ovaj racun?");

    if (potvrda) {
      const finishDelete = async () => {
        const res = await deleteAccount(id);
        if (res?.error) throw new Error("Greška pri brisanju.");
      };

      toast.promise(finishDelete(), {
        loading: "Brisanje korisnickog naloga...",
        success: () => {
          router.refresh();
          return "Korisnički nalog je uspjesno obrisan!";
        },
        error: (err) => {
          return err.message || "Greška pri brisanju.";
        },
      });
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
