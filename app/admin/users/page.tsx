import { prisma } from "@/lib/prisma";
import UsersTable from "@/components/admin/UsersTable";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 animate-fadeUp">
        <h1 className="text-2xl font-bold text-zinc-900">Korisnici</h1>
        <p className="text-sm text-amber-600 mt-0.5">
          Ovdje možete vidjeti listu svih korisnika.
        </p>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
