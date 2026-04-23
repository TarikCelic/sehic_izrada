import boss from "../../public/founder.jpg"
import Image from "next/image"

export default function AboutPage() {
    return (
        <section className="min-h-screen w-full bg-(--foreground) flex items-center justify-center py-20 px-6 md:px-12 lg:px-24 overflow-x-hidden">

            <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

                <div className="flex-1 flex flex-col items-start gap-8 animate-fade-left">
                    <h1 className="text-(--primary) text-5xl md:text-6xl lg:text-7xl font-sekuya uppercase tracking-tight">
                        Naša priča
                    </h1>

                    <div className="text-white/90 text-left max-w-xl text-lg md:text-xl leading-relaxed font-light">
                        <p className="mb-6">
                            <span className="font-bold text-white border-b border-(--primary)">Senaid Šehić</span> je osnivač brenda <span className="text-(--primary)">Sehić Izrada</span>, nastalog iz jednostavne ideje koja je kroz šest godina prerasla u ozbiljan i posvećen zanat.
                        </p>
                        <p className="mb-6">
                            Sve je počelo izradom prvog drvenog stola, a danas iza njega stoji niz unikatnih komada namještaja oblikovanih kroz iskustvo i kontinuirano usavršavanje.
                        </p>
                        <p>
                            Fokus njegovog rada je na ručnoj izradi, kvalitetu i pažljivo osmišljenom dizajnu. Svakom projektu pristupa s posebnom pažnjom, stvarajući namještaj koji ima <span className="italic">karakter i trajnost</span>.
                        </p>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-md lg:max-w-none flex flex-col gap-4 animate-fade-right">
                    <div className="relative aspect-[3/4] w-full lg:max-w-[500px] mx-auto border border-white/10 rounded-sm overflow-hidden shadow-2xl">
                        <Image
                            src={boss}
                            fill
                            alt="Senaid Šehić"
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
                            priority
                        />
                    </div>

                    <div className="flex justify-between items-center w-full lg:max-w-[500px] mx-auto px-1">
                        <p className="text-(--primary) font-bold tracking-widest uppercase text-sm">Senaid Šehić</p>
                        <div className="h-[1px] flex-1 mx-4 bg-(--primary)/30 hidden sm:block"></div>
                        <p className="text-white/40 uppercase text-sm tracking-widest">Osnivač</p>
                    </div>
                </div>

            </div>
        </section>
    )
}