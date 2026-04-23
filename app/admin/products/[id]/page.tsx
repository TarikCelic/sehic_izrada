import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditProductForm from "@/components/admin/EditProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, colors: true },
  });

  if (!product) notFound();

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Uredi Proizvod</h1>
        <p className="text-sm text-amber-600 mt-0.5">
          Izmjenite informacije o proizvodu.
        </p>
      </div>
      <EditProductForm product={product} />
    </div>
  );
}
