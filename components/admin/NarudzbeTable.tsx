'use client'

import { useState } from "react"
import Link from "next/link"
import { Settings } from "lucide-react"
import DeleteOrder from "@/components/admin/DeleteOrder"
import OrderInfo from "@/components/admin/OrderInfo"

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        NOVA: "bg-blue-100 text-blue-700",
        U_OBRADI: "bg-amber-100 text-amber-700",
        ZAVRSENA: "bg-green-100 text-green-700",
        OTKAZANA: "bg-red-100 text-red-600",
    }
    const cls = colors[status] ?? "bg-zinc-100 text-zinc-600"
    return (
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${cls}`}>
            {status}
        </span>
    )
}

export default function NarudzbeTable({ orders }: { orders: any[] }) {
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null)

    return (
        <>
            {selectedOrder && (
                <OrderInfo
                    narudzba={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

            <div className="hidden sm:block bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm animate-fade-down">
                    <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200">
                        {["ID", "NARUČUJE", "PROIZVOD", "ADRESA", "STATUS", "AKCIJE"].map((h) => (
                            <th key={h} className="px-4 py-3 text-center text-[11px] font-semibold text-zinc-400 tracking-widest uppercase border-r border-zinc-100 last:border-r-0">
                                {h}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50/70 transition-colors">
                            <td className="py-3.5 text-center border-r border-zinc-100">
                                <span className="text-amber-500 font-mono text-xs">#{order.id}</span>
                            </td>
                            <td className="px-4 py-3.5 text-center border-r border-zinc-100 font-medium text-zinc-900">
                                {order.ime} {order.prezime}
                            </td>
                            <td className="px-4 py-3.5 text-center border-r border-zinc-100 text-zinc-600">
                                {order.product.name}
                            </td>
                            <td className="px-4 py-3.5 text-center border-r border-zinc-100 text-zinc-500">
                                {order.adresa}
                            </td>
                            <td className="px-4 py-3.5 text-center border-r border-zinc-100">
                                <StatusBadge status={order.status} />
                            </td>
                            <td className="px-4 py-3.5 text-center ">
                                <div className="flex items-center justify-evenly gap-4">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
                                    >
                                        <Settings size={22} />
                                    </button>
                                    <DeleteOrder id={order.id} />
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="sm:hidden space-y-3 animate-fade-down">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-amber-600 font-mono text-xs">#{order.id}</span>
                            <StatusBadge status={order.status} />
                        </div>
                        <p className="font-bold text-zinc-900">{order.ime} {order.prezime}</p>
                        <p className="text-sm text-zinc-500 mb-3">{order.product.name}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 ">
                            <button
                                onClick={() => setSelectedOrder(order)}
                                className="text-sm text-blue-600 font-medium flex items-center gap-1 "
                            >
                                <Settings size={15} /> Detalji
                            </button>
                            <DeleteOrder id={order.id} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}