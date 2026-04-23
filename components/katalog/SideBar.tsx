"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import Icons from "@/public/svg/customSVGFilter"

type Category = "STOLOVI" | "POLICE" | "STOLICE" | "KOMODE" | "VRATA";
type WoodType = "HRAST" | "BUKVA" | "ORAH" | "JASEN" | "TRESNJA" | "BOR" | "JELA" | "MEDIJAPAN" | "IVERICA";
type Color    = "BIJELA" | "CRNA" | "DRVO";
type SortBy   = "newest" | "popular" | "price_asc" | "price_desc";

const MAX_PRICE = 5000;

const CATEGORIES: { value: Category; label: string }[] = [
    { value: "STOLOVI",  label: "Stolovi"  },
    { value: "POLICE",   label: "Police"   },
    { value: "STOLICE",  label: "Stolice"  },
    { value: "KOMODE",   label: "Komode"   },
    { value: "VRATA",    label: "Vrata"    },
];

const WOOD_TYPES: { value: WoodType; label: string; hex: string }[] = [
    { value: "HRAST",     label: "Hrast",     hex: "#7c5c3a" },
    { value: "BUKVA",     label: "Bukva",     hex: "#a07850" },
    { value: "ORAH",      label: "Orah",      hex: "#4e3220" },
    { value: "JASEN",     label: "Jasen",     hex: "#c8a97a" },
    { value: "TRESNJA",   label: "Trešnja",   hex: "#8b3a2f" },
    { value: "BOR",       label: "Bor",       hex: "#d4aa70" },
    { value: "JELA",      label: "Jela",      hex: "#9e7b55" },
    { value: "MEDIJAPAN", label: "Medijapan", hex: "#c8b89a" },
    { value: "IVERICA",   label: "Iverica",   hex: "#b8a898" },
];

const COLORS: { value: Color; label: string; bg: string }[] = [
    { value: "BIJELA", label: "Bijela", bg: "#f5f5f0" },
    { value: "CRNA",   label: "Crna",   bg: "#1a1a1a" },
    { value: "DRVO",   label: "Drvo",   bg: "#8b6340" },
];

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
    { value: "newest",     label: "Najnovije"      },
    { value: "popular",    label: "Popularno"      },
    { value: "price_asc",  label: "Cijena ↑"       },
    { value: "price_desc", label: "Cijena ↓"       },
];

function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="pb-5 border-b border-white/8 last:border-0 last:pb-0">
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/30 mb-3 pl-1">{title}</p>
            {children}
        </div>
    );
}

function FilterPanel({ onClose }: { onClose?: () => void }) {
    const router = useRouter();
    const sp = useSearchParams();

    const categories  = useMemo(() => (sp.get("categories")?.split(",").filter(Boolean) ?? []) as Category[], [sp]);
    const woodTypes   = useMemo(() => (sp.get("woodTypes")?.split(",").filter(Boolean)  ?? []) as WoodType[], [sp]);
    const colors      = useMemo(() => (sp.get("colors")?.split(",").filter(Boolean)     ?? []) as Color[],    [sp]);
    const urlMinPrice = Number(sp.get("minPrice") ?? 0);
    const urlMaxPrice = Number(sp.get("maxPrice") ?? MAX_PRICE);
    const sortBy      = (sp.get("sortBy") ?? "newest") as SortBy;

    const [localMin, setLocalMin] = useState(urlMinPrice);
    const [localMax, setLocalMax] = useState(urlMaxPrice);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => { setLocalMin(urlMinPrice); }, [urlMinPrice]);
    useEffect(() => { setLocalMax(urlMaxPrice); }, [urlMaxPrice]);

    const push = useCallback((patch: Record<string, string | null>) => {
        const params = new URLSearchParams(sp.toString());
        for (const [key, val] of Object.entries(patch)) {
            if (val === null || val === "") params.delete(key);
            else params.set(key, val);
        }
        router.push(`?${params.toString()}`, { scroll: false });
    }, [router, sp]);

    const setCategories = (next: Category[]) => push({ categories: next.join(",") || null });
    const setWoodTypes  = (next: WoodType[]) => push({ woodTypes:  next.join(",") || null });
    const setColors     = (next: Color[])    => push({ colors:     next.join(",") || null });
    const setSort       = (val: SortBy)      => push({ sortBy: val === "newest" ? null : val });

    const debouncedPrice = (newMin: number, newMax: number) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            push({
                minPrice: newMin === 0         ? null : String(newMin),
                maxPrice: newMax === MAX_PRICE ? null : String(newMax),
            });
        }, 400);
    };

    const activeCount =
        categories.length + woodTypes.length + colors.length +
        (urlMinPrice > 0 || urlMaxPrice < MAX_PRICE ? 1 : 0) +
        (sortBy !== "newest" ? 1 : 0);

    return (
        <div className="flex flex-col gap-5 h-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60">
                    {Icons.Filter}
                    <span className="text-xs font-semibold tracking-widest uppercase">Filteri</span>
                    {activeCount > 0 && (
                        <span className="bg-[var(--primary)] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {activeCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {activeCount > 0 && (
                        <button
                            onClick={() => router.push("?", { scroll: false })}
                            className="text-[10px] text-[var(--primary)] hover:text-[var(--primary)]/80 font-semibold transition-colors"
                        >
                            Resetuj
                        </button>
                    )}
                    {onClose && (
                        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                            {Icons.Close}
                        </button>
                    )}
                </div>
            </div>

            <Section title="Sortiraj po">
                <div className="grid grid-cols-2 gap-1.5">
                    {SORT_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setSort(opt.value)}
                            className={`text-[11px] py-2 px-3 rounded-lg transition-all text-left font-medium border
                                ${sortBy === opt.value
                                ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                                : "bg-white/4 text-white/45 border-white/8 hover:bg-white/8 hover:text-white/75 hover:border-white/15"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </Section>

            <Section title="Kategorija">
                <div className="flex flex-col gap-0.5">
                    {CATEGORIES.map(cat => {
                        const active = categories.includes(cat.value);
                        const Icon = Icons[cat.value];
                        return (
                            <button
                                key={cat.value}
                                onClick={() => setCategories(toggle(categories, cat.value))}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all w-full text-left group
                                    ${active
                                    ? "bg-[var(--primary)]/12 text-[var(--primary)] border border-[var(--primary)]/25"
                                    : "text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent"
                                }`}
                            >
                                <span className={`transition-colors ${active ? "text-[var(--primary)]" : "text-white/30 group-hover:text-white/55"}`}>
                                    {Icon}
                                </span>
                                <span className="font-medium">{cat.label}</span>
                                {active && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </Section>

            <Section title="Raspon cijene">
                <div className="px-1">
                    <div className="flex justify-between items-baseline mb-3">
                        <span className="text-sm font-semibold text-[var(--primary)]">{localMin.toLocaleString()} KM</span>
                        <span className="text-xs text-white/35">—</span>
                        <span className="text-sm font-semibold text-white/70">{localMax.toLocaleString()} KM</span>
                    </div>
                    <div className="relative h-1 bg-white/10 rounded-full mb-4">
                        <div
                            className="absolute h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/70 rounded-full"
                            style={{
                                left:  `${(localMin / MAX_PRICE) * 100}%`,
                                right: `${100 - (localMax / MAX_PRICE) * 100}%`,
                            }}
                        />
                    </div>
                    <input
                        type="range" min={0} max={MAX_PRICE} step={50}
                        value={localMin}
                        onChange={e => {
                            const v = Math.min(Number(e.target.value), localMax - 50);
                            setLocalMin(v);
                            debouncedPrice(v, localMax);
                        }}
                        className="w-full h-1 accent-[var(--primary)] mb-2 cursor-pointer opacity-80 hover:opacity-100"
                    />
                    <input
                        type="range" min={0} max={MAX_PRICE} step={50}
                        value={localMax}
                        onChange={e => {
                            const v = Math.max(Number(e.target.value), localMin + 50);
                            setLocalMax(v);
                            debouncedPrice(localMin, v);
                        }}
                        className="w-full h-1 accent-[var(--primary)] cursor-pointer opacity-80 hover:opacity-100"
                    />
                </div>
            </Section>

            <Section title="Vrsta drveta">
                <div className="flex flex-wrap gap-1.5">
                    {WOOD_TYPES.map(wood => {
                        const active = woodTypes.includes(wood.value);
                        return (
                            <button
                                key={wood.value}
                                onClick={() => setWoodTypes(toggle(woodTypes, wood.value))}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all border
                                    ${active
                                    ? "bg-[var(--primary)]/12 text-[var(--primary)] border-[var(--primary)]/25"
                                    : "bg-white/4 text-white/45 border-white/8 hover:bg-white/8 hover:text-white/75"
                                }`}
                            >
                                <span
                                    className="w-2.5 h-2.5 rounded-sm shrink-0 ring-1 ring-white/10"
                                    style={{ backgroundColor: wood.hex }}
                                />
                                {wood.label}
                            </button>
                        );
                    })}
                </div>
            </Section>

            <Section title="Boja završnice">
                <div className="flex gap-5 pl-1">
                    {COLORS.map(color => {
                        const active = colors.includes(color.value);
                        return (
                            <button
                                key={color.value}
                                onClick={() => setColors(toggle(colors, color.value))}
                                className="flex flex-col items-center gap-2 group"
                                title={color.label}
                            >
                                <span
                                    className={`w-9 h-9 rounded-full block transition-all duration-200
                                        ${active
                                        ? "ring-2 ring-offset-2 ring-offset-[#0f0f0f] ring-[var(--primary)] scale-110"
                                        : "ring-1 ring-white/15 group-hover:ring-white/35 group-hover:scale-105"
                                    }`}
                                    style={{ backgroundColor: color.bg }}
                                />
                                <span className={`text-[10px] font-medium transition-colors
                                    ${active ? "text-[var(--primary)]" : "text-white/30 group-hover:text-white/55"}`}
                                >
                                    {color.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </Section>
        </div>
    );
}

export default function ProductFilters() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const sp = useSearchParams();

    const activeCount = useMemo(() => {
        const cats = sp.get("categories")?.split(",").filter(Boolean).length ?? 0;
        const woods = sp.get("woodTypes")?.split(",").filter(Boolean).length ?? 0;
        const cols = sp.get("colors")?.split(",").filter(Boolean).length ?? 0;
        const price = (Number(sp.get("minPrice") ?? 0) > 0 || Number(sp.get("maxPrice") ?? MAX_PRICE) < MAX_PRICE) ? 1 : 0;
        const sort = sp.get("sortBy") ? 1 : 0;
        return cats + woods + cols + price + sort;
    }, [sp]);

    return (
        <>
            <div className="hidden lg:block h-full overflow-y-auto p-5">
                <FilterPanel />
            </div>

            <div className="lg:hidden">
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/6 border border-white/10 text-sm text-white/65 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                >
                    {Icons.Filter}
                    <span className="font-medium">Filteri</span>
                    {activeCount > 0 && (
                        <span className="bg-[var(--primary)] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {activeCount}
                        </span>
                    )}
                </button>
            </div>

            {drawerOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm lg:hidden"
                        onClick={() => setDrawerOpen(false)}
                    />
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f0f] border-t border-white/10 rounded-t-2xl p-5 max-h-[88vh] overflow-y-auto lg:hidden">
                        <div className="w-10 h-1 bg-white/15 rounded-full mx-auto mb-5" />
                        <FilterPanel onClose={() => setDrawerOpen(false)} />
                    </div>
                </>
            )}
        </>
    );
}