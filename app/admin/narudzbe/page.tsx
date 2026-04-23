import { prisma } from "@/lib/prisma";
import NarudzbeTable from "@/components/admin/NarudzbeTable";

export default async function NarudzbePage() {
    const orders = await prisma.narudzba.findMany({
        include: {
            product: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="p-4 sm:p-6 relative">
            <div className="mb-6 animate-fadeUp">
                <h1 className="text-2xl font-bold text-zinc-900">Narudžbe</h1>
                <p className="text-sm text-amber-600 mt-0.5">
                    Ovdje možete vidjeti listu svih pristiglih narudžbi.
                </p>
            </div>
            <NarudzbeTable orders={orders as any} />
        </div>
    );
}