'use client'

import {useEffect, useState} from 'react'
import { createPortal } from 'react-dom'
import { createNarudzba } from '@/lib/katalog/actions'

type Color = 'BIJELA' | 'CRNA' | 'DRVO'

type Props = {
    productId: string
    productName: string
    availableColors: Color[]
    dimensions: string
}

const colorLabels: Record<Color, string> = {
    BIJELA: 'Bijela',
    CRNA: 'Crna',
    DRVO: 'Drvo',
}

const colorStyles: Record<Color, string> = {
    BIJELA: 'bg-white border-gray-300',
    CRNA: 'bg-black border-gray-600',
    DRVO: 'bg-[#8B4513] border-[#6b3410]',
}

export default function NaruciProizvod({ productId, productName, availableColors, dimensions }: Props) {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState<1 | 2>(1)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false)

    const [form, setForm] = useState({
        ime: '', prezime: '', email: '', telefon: '',
        adresa: '', kanton: '', postanskiBroj: '',
        boja: availableColors[0] ?? 'DRVO',
        dimenzije: dimensions,
        napomena: '',
    })

    const handleOpen = () => {
        setIsClosing(false)
        setIsVisible(false)
        setOpen(true)
        requestAnimationFrame(() => setIsVisible(true))
    }

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            setOpen(false)
            setIsClosing(false)
            setStep(1)
            setSuccess(false)
            setError('')
        }, 200)
    }

    const set = (field: string, value: string) =>
        setForm(prev => ({ ...prev, [field]: value }))

    const handleSubmit = async () => {
        if (!form.ime || !form.prezime || !form.email || !form.telefon || !form.adresa || !form.kanton || !form.postanskiBroj) {
            setError('Popuni sva obavezna polja.')
            return
        }
        setLoading(true)
        setError('')
        const result = await createNarudzba({ ...form, productId })
        setLoading(false)
        if (result?.success) {
            setSuccess(true)
        } else {
            setError('Greška pri slanju narudžbe.')
        }
    }

    const inputClass = "w-full border-2 border-white/10 bg-white/5 text-white placeholder:text-white/30 p-3 outline-none focus:border-[var(--primary)] transition-all duration-200 rounded-lg text-sm"
    const labelClass = "text-[10px] text-white/40 uppercase tracking-widest mb-1 block"

    const modal = (
        <div className={`fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-200 ${isClosing || !isVisible ? 'opacity-0' : 'opacity-100'}`}>
            <div className={`bg-[var(--foreground)] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col  transition-all duration-200 ease-in-out
    ${isClosing || !isVisible
                    ? 'opacity-0 translate-y-4'
                    : 'opacity-100 translate-y-0'
                }`}>

                <div className={`flex items-center justify-between p-6 border-b border-white/10`}
            >
                    <div>
                        <p className="text-white font-bold text-lg">Naruči proizvod</p>
                        <p className="text-white/40 text-xs mt-0.5">{productName}</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="cursor-pointer w-9 h-9 flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all rounded-lg text-xl"
                    >
                        ×
                    </button>
                </div>

                {success ? (
                    <div className="flex flex-col items-center justify-center gap-4 p-10 text-center">
                        <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-3xl">✓</div>
                        <p className="text-white font-bold text-xl">Narudžba poslana!</p>
                        <p className="text-white/50 text-sm">Kontaktiracemo vas uskoro na <span className="text-white">{form.email}</span></p>
                        <button
                            onClick={handleClose}
                            className="mt-2 px-6 py-2 bg-[var(--primary)] text-white rounded-lg text-sm"
                        >
                            Zatvori
                        </button>
                    </div>
                ) : (
                    <div className="p-6 flex flex-col gap-6">

                        <div className="flex gap-2">
                            {[1, 2].map(s => (
                                <div
                                    key={s}
                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= s ? 'bg-[var(--primary)]' : 'bg-white/10'}`}
                                />
                            ))}
                        </div>

                        {step === 1 && (
                            <div className="flex flex-col gap-4">
                                <p className="text-white/60 text-xs uppercase tracking-widest">Korak 1 — Lični podaci</p>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Ime *</label>
                                        <input value={form.ime} onChange={e => set('ime', e.target.value)} placeholder="Ime" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Prezime *</label>
                                        <input value={form.prezime} onChange={e => set('prezime', e.target.value)} placeholder="Prezime" className={inputClass} />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>Email *</label>
                                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@primjer.ba" className={inputClass} />
                                </div>

                                <div>
                                    <label className={labelClass}>Telefon *</label>
                                    <input value={form.telefon} onChange={e => set('telefon', e.target.value)} placeholder="+387 61 000 000" className={inputClass} />
                                </div>

                                <div>
                                    <label className={labelClass}>Adresa *</label>
                                    <input value={form.adresa} onChange={e => set('adresa', e.target.value)} placeholder="Ulica i broj" className={inputClass} />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Kanton *</label>
                                        <input value={form.kanton} onChange={e => set('kanton', e.target.value)} placeholder="Kanton" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Poštanski broj *</label>
                                        <input value={form.postanskiBroj} onChange={e => set('postanskiBroj', e.target.value)} placeholder="71000" className={inputClass} />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full bg-[var(--primary)] text-white py-3 rounded-xl font-bold text-sm uppercase tracking-widest mt-2 hover:opacity-90 transition-opacity"
                                >
                                    Dalje →
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="flex flex-col gap-4">
                                <p className="text-white/60 text-xs uppercase tracking-widest">Korak 2 — Detalji proizvoda</p>

                                <div>
                                    <label className={labelClass}>Boja</label>
                                    <div className="flex gap-3 mt-1">
                                        {availableColors.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => set('boja', color)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                                                    form.boja === color
                                                        ? 'border-[var(--primary)] text-white'
                                                        : 'border-white/10 text-white/50 hover:border-white/30'
                                                }`}
                                            >
                                                <span className={`w-4 h-4 rounded-full border ${colorStyles[color]}`} />
                                                {colorLabels[color]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>Dimenzije</label>
                                    <input
                                        value={form.dimenzije}
                                        onChange={e => set('dimenzije', e.target.value)}
                                        placeholder="npr. 120x60x75 cm"
                                        className={inputClass}
                                    />
                                    <p className="text-white/30 text-xs mt-1">Standardne dimenzije: {dimensions}. Možete prilagoditi.</p>
                                </div>

                                <div>
                                    <label className={labelClass}>Napomena <span className="normal-case text-white/20">(opcionalno)</span></label>
                                    <textarea
                                        value={form.napomena}
                                        onChange={e => set('napomena', e.target.value)}
                                        placeholder="Posebni zahtjevi, napomene..."
                                        rows={3}
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>

                                {error && <p className="text-red-400 text-sm">{error}</p>}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 border border-white/10 text-white/60 py-3 rounded-xl text-sm hover:border-white/30 transition-all"
                                    >
                                        ← Nazad
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="flex-1 bg-[var(--primary)] text-white py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-40"
                                    >
                                        {loading ? 'Slanje...' : 'Pošalji narudžbu'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <>
            <button
                onClick={handleOpen}
                className="cursor-pointer flex-1 bg-[var(--primary)] text-white font-bold py-4 px-6 rounded-xl text-sm uppercase tracking-widest border border-transparent hover:bg-transparent hover:border-[var(--primary)] hover:text-[var(--primary)] active:scale-[0.98] transition-all duration-300"
            >
                Naruči
            </button>

            {(open || isClosing) && createPortal(modal, document.body)}
        </>
    )
}