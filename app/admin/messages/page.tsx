import { prisma } from "@/lib/prisma";
import MessagesTable from "@/components/admin/MessagesTable";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 sm:p-6 relative">
      <div className="mb-6 animate-fadeUp">
        <h1 className="text-2xl font-bold text-zinc-900">Poruke</h1>
        <p className="text-sm text-amber-600 mt-0.5">
          Ovdje možete vidjeti sve pristigle upite i poruke.
        </p>
      </div>
      <MessagesTable messages={messages as any} />
    </div>
  );
}
