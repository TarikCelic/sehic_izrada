'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { updateOrderStatus } from '@/lib/admin/actions'
import {toast} from "sonner";

const STATUSES = ["NOVA", "U_OBRADI", "ZAVRSENA", "OTKAZANA"] as const

const STATUS_LABELS: Record<string, string> = {
    NOVA: "Nova",
    U_OBRADI: "U obradi",
    ZAVRSENA: "Završena",
    OTKAZANA: "Otkazana",
}

const STATUS_COLORS: Record<string, string> = {
    NOVA: "bg-blue-100 text-blue-700 border-blue-200",
    U_OBRADI: "bg-amber-100 text-amber-700 border-amber-200",
    ZAVRSENA: "bg-green-100 text-green-700 border-green-200",
    OTKAZANA: "bg-red-100 text-red-600 border-red-200",
}

const OrderInfo = ({ narudzba, onClose }: { narudzba: any, onClose: () => void }) => {
    const [selectedStatus, setSelectedStatus] = useState<string>(narudzba.status)
    const [isPending, startTransition] = useTransition()
    const [saved, setSaved] = useState(false)
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = 'unset' }
    }, [])

    const handleSave = () => {


        startTransition(async () => {
            await updateOrderStatus(narudzba.id, selectedStatus)
            toast.info("Promjene su spremljene!")
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        })
    }

    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true))
    }, [])

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            onClose()
        }, 200)
    }

    const hasChanged = selectedStatus !== narudzba.status

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-200 ease-in-out
    ${isClosing || !isVisible
                ? 'opacity-0 translate-y-4'
                : 'opacity-100 translate-y-0'
            }`} onClick={onClose}
            />

            <div className={`relative bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col    transition-all duration-200 ease-in-out
    ${isClosing || !isVisible
                ? 'opacity-0 translate-y-4'
                : 'opacity-100 translate-y-0'
            }`}>

                <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900">Detalji narudžbe</h2>
                        <p className="text-xs text-zinc-400 font-mono mt-1">ID: {narudzba.id}</p>
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
                            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b pb-1">Proizvod</h3>
                            <div>
                                <p className="text-sm font-medium text-zinc-900">{narudzba.product.name}</p>
                                <p className="text-xs text-zinc-500 mt-1">Dimenzije: {narudzba.dimenzije}</p>
                                <p className="text-xs text-zinc-500">Boja: {narudzba.boja}</p>
                                <Link
                                    href={`/katalog/${narudzba.product.id}`}
                                    className="text-xs text-blue-500 hover:underline mt-2 inline-block"
                                >
                                    Pogledaj na sajtu →
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b pb-1">Kupac</h3>
                            <div className="text-sm">
                                <p className="font-medium text-zinc-900">{narudzba.ime} {narudzba.prezime}</p>
                                <p className="text-zinc-600 mt-1">{narudzba.telefon}</p>
                                <p className="text-zinc-600">{narudzba.email}</p>
                                <p className="text-zinc-600 mt-2">{narudzba.adresa}, {narudzba.postanskiBroj}</p>
                                <p className="text-zinc-600">{narudzba.kanton}</p>
                            </div>
                        </div>

                        <div className="col-span-full space-y-3">
                            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b pb-1">Status narudžbe</h3>
                            <div className="flex flex-wrap gap-2">
                                {STATUSES.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSelectedStatus(s)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase border transition-all ${
                                            selectedStatus === s
                                                ? STATUS_COLORS[s]
                                                : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400"
                                        }`}
                                    >
                                        {STATUS_LABELS[s]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-full space-y-2">
                            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b pb-1">Napomena</h3>
                            <p className="text-sm text-zinc-600 italic bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                                {narudzba.napomena || "Nema dodatne napomene."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between gap-3">
                    <div className="text-xs text-zinc-400">
                        {saved && <span className="text-green-600 font-medium">Sačuvano</span>}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
                        >
                            Zatvori
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanged || isPending}
                            className="px-6 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Čuvam..." : "Spasi izmjene"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderInfo