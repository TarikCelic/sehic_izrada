import Image from "next/image";
import Link from "next/link";
import { Settings, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        include: {
            images: { take: 1 },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6 animate-fadeUp">
                <h1 className="text-2xl font-bold text-zinc-900">Proizvodi</h1>
                <p className="text-sm text-amber-600 mt-0.5">Ovdje možete vidjeti listu svih proizvoda.</p>
            </div>

            <div className="hidden sm:block bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full  animate-fade-down">
                    <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200">
                        {["ID", "PREVIEW", "IME PROIZVODA", "CIJENA", "KATEGORIJA", "AKCIJE"].map((h) => (
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
                    {products.map((product) => (
                        <tr
                            key={product.id}
                            className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50/70 transition-colors"
                        >
                            <td className=" py-3.5 text-center border-r border-zinc-100">
                                <span className="text-amber-500 font-semibold text-sm">#{product.id}</span>
                            </td>

                            <td className="px-4 py-3.5 text-center border-r border-zinc-100">
                                {product.images[0]?.url ? (
                                    <div className="relative w-9 h-9 rounded-md overflow-hidden mx-auto">
                                        <Image
                                            src={product.images[0].url}
                                            fill
                                            alt={product.name}
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-9 h-9 rounded-md bg-zinc-100 flex items-center justify-center mx-auto">
                                        <Package size={15} className="text-zinc-400" />
                                    </div>
                                )}
                            </td>

                            <td className="px-4 py-3.5 border-r border-zinc-100">
                                <span className="font-medium text-zinc-800 text-sm">{product.name}</span>
                            </td>

                            <td className="px-4 py-3.5 text-center border-r border-zinc-100">
                                <span className="text-zinc-500 text-sm">{product.price} KM</span>
                            </td>

                            <td className="px-4 py-3.5 text-center border-r border-zinc-100 lowercase first-letter:uppercase">
                                <span className="text-zinc-500  text-sm ">{product.category}</span>
                            </td>

                            <td className="px-4 py-3.5 text-center">
                                <div className="flex items-center justify-evenly gap-3">
                                    <Link href={`/admin/products/${product.id}`} className="text-blue-400 hover:text-blue-600 transition-colors">
                                        <Settings size={20} />
                                    </Link>
                                    <DeleteProductButton id={product.id} />
                                </div>
                            </td>
                        </tr>
                    ))}

                    {products.length === 0 && (
                        <tr>
                            <td colSpan={6} className="py-14 text-center text-zinc-300 text-sm">
                                Nema proizvoda.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="sm:hidden space-y-3 animate-fade-down">
                {products.map((product) => (
                    <div key={product.id} className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            {product.images[0]?.url ? (
                                <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0">
                                    <Image
                                        src={product.images[0].url}
                                        fill
                                        alt={product.name}
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-md bg-zinc-100 flex items-center justify-center shrink-0">
                                    <Package size={15} className="text-zinc-400" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-zinc-800 truncate">{product.name}</p>
                                <p className="text-xs text-zinc-400 capitalize">{product.category}</p>
                            </div>
                            <span className="text-zinc-600 font-medium text-sm shrink-0">{product.price} KM</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                            <span className="text-xs text-amber-500 font-medium truncate max-w-[200px]">#{product.id}</span>
                            <div className="flex gap-3">
                                <Link href={`/admin/products/${product.id}`} className="text-blue-400 hover:text-blue-600 transition-colors">
                                    <Settings size={20} />
                                </Link>
                                <DeleteProductButton id={product.id} />
                            </div>
                        </div>
                    </div>
                ))}

                {products.length === 0 && (
                    <div className="py-16 text-center text-zinc-300 text-sm">
                        Nema proizvoda.
                    </div>
                )}
            </div>
        </div>
    );
}