"use client";

import { useEffect, useState } from "react";
import { deleteMessage } from "@/lib/admin/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const MessageInfo = ({
  poruka,
  onClose,
}: {
  poruka: any;
  onClose: () => void;
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 200);
  };

  const handleDelete = async () => {
    const potvrda = confirm("Da li ste sigurni da želite obrisati ovu poruku?");
    if (!potvrda) return;

    setIsDeleting(true);
    const finish = async () => {
      const res = await deleteMessage(poruka.id);
      if (res?.error) throw new Error("Greška pri brisanju.");
    };

    toast.promise(finish(), {
      loading: "Brisanje poruke...",
      success: () => {
        router.refresh();
        onClose();
        return "Poruka je uspješno obrisana!";
      },
      error: (err) => err.message || "Greška pri brisanju.",
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-200 ease-in-out
                    ${isClosing || !isVisible ? "opacity-0" : "opacity-100"}`}
        onClick={handleClose}
      />

      <div
        className={`relative bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col transition-all duration-200 ease-in-out
                ${isClosing || !isVisible ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-white">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Detalji poruke</h2>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              ID: {poruka.id}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b pb-1">
                Pošiljalac
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-medium text-zinc-900">{poruka.ime}</p>
                <p className="text-zinc-500">{poruka.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b pb-1">
                Datum
              </h3>
              <p className="text-sm text-zinc-600">
                {new Date(poruka.createdAt).toLocaleDateString("bs-BA", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="col-span-full space-y-2">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b pb-1">
                Poruka
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-lg border border-zinc-100 whitespace-pre-wrap">
                {poruka.poruka}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between gap-3">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="cursor-pointer px-5 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Obriši poruku
          </button>
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all cursor-pointer"
          >
            Zatvori
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInfo;
