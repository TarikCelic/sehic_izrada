"use client";

import { useState } from "react";
import { deleteMessage } from "@/lib/admin/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import MessageInfo from "./MessagesInfo";
import DeleteIcon from "@/public/svg/delete.svg";
import Image from "next/image";

type Poruka = {
  id: string;
  ime: string;
  email: string;
  poruka: string;
  createdAt: Date;
};

export default function MessagesTable({ messages }: { messages: Poruka[] }) {
  const [selectedMessage, setSelectedMessage] = useState<Poruka | null>(null);
  const router = useRouter();

  const handleDelete = (poruka: Poruka) => {
    const potvrda = confirm("Da li ste sigurni da želite obrisati ovu poruku?");
    if (!potvrda) return;

    const finish = async () => {
      const res = await deleteMessage(poruka.id);
      if (res?.error) throw new Error("Greška pri brisanju.");
    };

    toast.promise(finish(), {
      loading: "Brisanje poruke...",
      success: () => {
        router.refresh();
        return "Poruka je uspješno obrisana!";
      },
      error: (err) => err.message || "Greška pri brisanju.",
    });
  };

  return (
    <>
      <div className="flex flex-col w-full rounded-2xl overflow-hidden border border-gray-100 animate-fade">
        <div className="bg-black/5 text-gray-800 uppercase font-mono text-xs tracking-widest flex items-center w-full px-4 py-3 border-b border-black/10">
          <div className="w-36 shrink-0">Ime</div>
          <div className="w-48 hidden md:block shrink-0">E-mail</div>
          <div className="flex-1 min-w-0">Poruka</div>
          <div className="w-28 shrink-0 hidden sm:block">Datum</div>
          <div className="w-20 shrink-0 text-center">Akcije</div>
        </div>

        {messages.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-gray-400">
            Nema pristiglih poruka.
          </div>
        ) : (
          messages.map((item) => (
            <div
              key={item.id}
              className="flex items-center w-full px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm"
            >
              <div className="w-36 shrink-0 font-medium text-gray-900 truncate pr-2">
                {item.ime}
              </div>
              <div className="w-48 hidden md:block shrink-0 text-gray-500 truncate pr-2">
                {item.email}
              </div>
              <div className="flex-1 min-w-0 text-gray-500 truncate pr-4">
                {item.poruka.length > 60
                  ? item.poruka.slice(0, 60) + "..."
                  : item.poruka}
              </div>
              <div className="w-28 shrink-0 hidden sm:block text-gray-400 text-xs font-mono">
                {new Date(item.createdAt).toLocaleDateString("bs-BA", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
              <div className="w-20 shrink-0 flex items-center justify-evenly gap-2">
                <button
                  onClick={() => setSelectedMessage(item)}
                  title="Pogledaj poruku"
                  className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer text-blue-500 hover:text-blue-700 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => handleDelete(item)}
                  title="Obriši poruku"
                  className="w-5 h-5 opacity-70 hover:opacity-50 hover:text-red-500 transition-all cursor-pointer "
                >
                  <Image src={DeleteIcon} alt="delete" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedMessage && (
        <MessageInfo
          poruka={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </>
  );
}
