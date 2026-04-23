"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProduct } from "@/lib/admin/actions";

const COLORS = [
    { id: "white", label: "Bijela", value: "BIJELA" },
    { id: "black", label: "Crna",   value: "CRNA"   },
    { id: "wooden",label: "Uzorak drveta", value: "DRVO" }
];

export default function EditProductForm({ product }: { product: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [podrzaneBoje, setPodrzaneBoje] = useState<string[]>(
        product.colors.map((c: any) => c.color)
    );

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setPodrzaneBoje(prev =>
            checked ? [...prev, value] : prev.filter(c => c !== value)
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.set("boje", JSON.stringify(podrzaneBoje));

        const promise = async () => {
            const result = await updateProduct(product.id, formData);
            if (result?.error) throw new Error(result.error);
        };

        toast.promise(promise(), {
            loading: "Ažuriranje proizvoda...",
            success: () => {
                router.push("/admin/products");
                return "Proizvod uspješno ažuriran!";
            },
            error: (err) => {
                setLoading(false);
                return err.message || "Greška pri ažuriranju.";
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">

            <div className="flex flex-col">
                <label className="font-mono uppercase text-[0.9rem] text-[--primary]">Ime proizvoda:</label>
                <input name="ime" defaultValue={product.name} type="text"
                       className="border border-black/10 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black/20" />
            </div>

            <div className="flex flex-col">
                <label className="font-mono uppercase text-[0.9rem] text-[--primary]">Opis proizvoda:</label>
                <textarea name="opis" defaultValue={product.description} rows={4}
                          className="border border-black/10 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black/20" />
            </div>

            <div className="flex flex-col">
                <label className="font-mono uppercase text-[0.9rem] text-[--primary]">Kategorija:</label>
                <select name="category" defaultValue={product.category}
                        className="border border-black/10 px-4 py-2 bg-white">
                    <option value="STOLOVI">Stolovi</option>
                    <option value="POLICE">Police</option>
                    <option value="STOLICE">Stolice</option>
                    <option value="KOMODE">Komode</option>
                    <option value="VRATA">Vrata</option>
                </select>
            </div>

            <div className="flex flex-col">
                <fieldset className="border border-black/10 px-4 py-2">
                    <legend className="text-sm font-semibold px-2">Podržane boje:</legend>
                    <div className="flex flex-col gap-1 mt-2">
                        {COLORS.map(color => (
                            <div key={color.id} className="flex items-center gap-2">
                                <input type="checkbox" id={color.id} value={color.value}
                                       checked={podrzaneBoje.includes(color.value)}
                                       onChange={handleCheckboxChange}
                                       className="cursor-pointer h-4 w-4" />
                                <label htmlFor={color.id} className="cursor-pointer select-none">{color.label}</label>
                            </div>
                        ))}
                    </div>
                </fieldset>
            </div>

            <div className="flex flex-col">
                <label className="font-mono uppercase text-[0.9rem] text-[--primary]">Vrsta drveta:</label>
                <select name="woodType" defaultValue={product.woodType}
                        className="border border-black/10 px-4 py-2 bg-white">
                    {["HRAST","BUKVA","ORAH","JASEN","TRESNJA","BOR","JELA","MEDIJAPAN","IVERICA"].map(w => (
                        <option key={w} value={w}>{w.charAt(0) + w.slice(1).toLowerCase()}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col">
                <label className="font-mono uppercase text-[0.9rem] text-[--primary]">Dimenzije:</label>
                <input name="dimenzije" defaultValue={product.dimensions} type="text"
                       placeholder="npr. 120x80x75 cm"
                       className="border border-black/10 px-4 py-2" />
            </div>

            <div className="flex flex-col">
                <label className="font-mono uppercase text-[0.9rem] text-[--primary]">Cijena (KM):</label>
                <input name="cijena" defaultValue={product.price} type="number"
                       className="border border-black/10 px-4 py-2" />
            </div>

            <div className="flex items-center gap-2">
                <input type="checkbox" id="isFeatured" name="isFeatured" value="true"
                       defaultChecked={product.isFeatured}
                       className="h-4 w-4 cursor-pointer" />
                <label htmlFor="isFeatured" className="text-sm cursor-pointer select-none">
                    Istaknuti proizvod
                </label>
            </div>

            <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => router.back()}
                        className="px-6 py-3 border border-black/20 text-sm hover:bg-zinc-50 transition-colors">
                    Odustani
                </button>
                <button type="submit" disabled={loading}
                        className={`flex-1 py-3 bg-black text-white font-bold uppercase text-sm transition-colors
                        ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-zinc-800"}`}>
                    {loading ? "Sačekajte..." : "Sačuvaj izmjene"}
                </button>
            </div>
        </form>
    );
}