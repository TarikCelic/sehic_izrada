"use client";

import { toggleFavourite } from "@/lib/katalog/actions";
import Image from "next/image";
import Fav from "@/public/svg/favourites.svg";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface AddToFavouriteProps {
  productId: string;
  initialFavourited: boolean;
  userId: string | null;
}

const AddToFavourite = ({
  productId,
  initialFavourited,
  userId,
}: AddToFavouriteProps) => {
  const [favourited, setFavourited] = useState(initialFavourited);
  const [isPending, startTransition] = useTransition();

  const handleFavourite = () => {
    if (!userId) {
      toast.warning("Moraš biti prijavljen da dodaš u omiljene!");
      return;
    }

    const newFavourited = !favourited;
    setFavourited(newFavourited);

    startTransition(async () => {
      try {
        await toggleFavourite(productId);
        toast.info(
          newFavourited ? "Dodato u omiljene!" : "Uklonjeno iz omiljenih.",
        );
      } catch {
        setFavourited(!newFavourited);
        toast.error("Greška, pokušaj ponovo.");
      }
    });
  };

  return (
    <button
      onClick={handleFavourite}
      type="button"
      className={`
        cursor-pointer p-4 rounded-xl border transition-all duration-300
        ${
          favourited
            ? "bg-white border-white/80 hover:bg-white/90"
            : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"
        }
    `}
    >
      <Image
        src={Fav}
        alt="Omiljeno"
        className={`w-5 h-5 transition-all duration-200
                    ${favourited ? "invert-0 scale-110" : "invert opacity-60"}
                `}
      />
    </button>
  );
};

export default AddToFavourite;
