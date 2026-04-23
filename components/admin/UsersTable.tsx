"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, Trash2, User } from "lucide-react";
import { ROLE } from "@prisma/client";
import DeleteAccountButton from "@/components/admin/DeleteAccountButton";
import { updateUserRole } from "@/lib/user/actions";
import { createPortal } from "react-dom";

const roles: ROLE[] = ["Korisnik", "Moderator", "Vlasnik", "Programer"];

const roleStyles: Record<ROLE, string> = {
  Korisnik: "bg-red-50 text-red-700 border-red-200",
  Moderator: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Vlasnik: "bg-amber-50 text-amber-700 border-amber-200",
  Programer: "bg-violet-50 text-violet-700 border-violet-200",
};

type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: ROLE;
  createdAt: Date;
};

function RoleDropdown({ userId, current }: { userId: string; current: ROLE }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(current);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleOpen() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
    setOpen(!open);
  }

  async function changeRole(newRole: ROLE) {
    setRole(newRole);
    setOpen(false);
    await updateUserRole(userId, newRole);
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-medium border cursor-pointer hover:opacity-80 transition-opacity ${roleStyles[role]}`}
      >
        {role}
      </button>

      {open &&
        createPortal(
          <div
            ref={ref}
            style={{ top: pos.top, left: pos.left }}
            className="fixed z-[9999] bg-white border border-zinc-200 rounded-lg shadow-md overflow-hidden min-w-[120px]"
          >
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => changeRole(r)}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-zinc-50 transition-colors flex items-center gap-2 ${
                  r === role ? "font-semibold text-zinc-900" : "text-zinc-600"
                }`}
              >
                {r}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}

export default function UsersTable({ users }: { users: User[] }) {
  return (
    <>
      <div className="hidden sm:block bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm animate-fade">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              {[
                "ID",
                "PREVIEW",
                "IME",
                "EMAIL",
                "ULOGA",
                "NAPRAVLJEN",
                "AKCIJE",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-center text-[11px] font-semibold text-zinc-400 tracking-widest border-r border-zinc-100 last:border-r-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={user.id}
                className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50/70 transition-colors"
              >
                <td className=" py-3.5 text-center border-r border-zinc-100">
                  <span className="text-amber-500 font-semibold">
                    #{user.id}
                  </span>
                </td>

                <td className="px-4 py-3.5 text-center border-r border-zinc-100">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center mx-auto">
                      <User size={15} className="text-zinc-400" />
                    </div>
                  )}
                </td>

                <td className="px-4 py-3.5 border-r border-zinc-100">
                  <span className="font-medium text-zinc-800">
                    {user.name || (
                      <span className="text-zinc-400 italic">—</span>
                    )}
                  </span>
                </td>

                <td className="px-4 py-3.5 text-center border-r border-zinc-100">
                  <span className="text-zinc-500">{user.email}</span>
                </td>

                <td className="px-4 py-3.5 text-center border-r border-zinc-100">
                  <RoleDropdown userId={user.id} current={user.role} />
                </td>

                <td className="px-4 py-3.5 text-center border-r border-zinc-100">
                  <span className="text-zinc-400 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("bs-BA")}
                  </span>
                </td>

                <td className="px-4 py-3.5 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <DeleteAccountButton id={user.id} />
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-14 text-center text-zinc-300 text-sm"
                >
                  Nema korisnika.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-3 animate-fade-down">
        {users.map((user, i) => (
          <div
            key={user.id}
            className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm "
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-amber-500 font-bold text-sm w-7">
                #{i + 1}
              </span>
              {user.image ? (
                <img
                  src={user.image}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                  <User size={15} className="text-zinc-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-800 truncate">
                  {user.name || <span className="text-zinc-400 italic">—</span>}
                </p>
                <p className="text-xs text-zinc-400 truncate">{user.email}</p>
              </div>
              <RoleDropdown userId={user.id} current={user.role} />
            </div>
            <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
              <span className="text-xs text-zinc-400">
                {new Date(user.createdAt).toLocaleDateString("bs-BA", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </span>
              <div className="flex gap-3">
                <DeleteAccountButton id={user.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
