export default function DarkLoading() {
    return (
        <section className="min-h-screen w-full py-20 px-6 md:px-12 bg-(--foreground) flex gap-10">

            <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-8 animate-pulse border-r border-white/5 pr-8">

                <div className="flex items-center justify-between">
                    <div className="h-5 w-24 bg-white/10 rounded" />
                    <div className="h-4 w-12 bg-white/5 rounded" />
                </div>

                <div className="flex flex-col gap-3">
                    <div className="h-3 w-20 bg-white/5 rounded tracking-widest mb-2" />
                    <div className="grid grid-cols-2 gap-2">
                        <div className="h-9 bg-white/10 rounded-lg" />
                        <div className="h-9 bg-white/10 rounded-lg" />
                        <div className="h-9 bg-white/10 rounded-lg" />
                        <div className="h-9 bg-white/10 rounded-lg" />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="h-3 w-24 bg-white/5 rounded tracking-widest mb-2" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-10 w-full bg-white/10 rounded-xl" />
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    <div className="h-3 w-24 bg-white/5 rounded tracking-widest mb-2" />
                    <div className="flex justify-between mb-2">
                        <div className="h-4 w-12 bg-white/10 rounded" />
                        <div className="h-4 w-12 bg-white/10 rounded" />
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full" />
                </div>

                <div className="flex flex-col gap-3">
                    <div className="h-3 w-24 bg-white/5 rounded tracking-widest mb-2" />
                    <div className="flex gap-4">
                        <div className="w-9 h-9 rounded-full bg-white/10" />
                        <div className="w-9 h-9 rounded-full bg-white/10" />
                        <div className="w-9 h-9 rounded-full bg-white/10" />
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                <div className="animate-pulse mb-10">
                    <div className="h-10 w-64 bg-white/10 rounded-lg mb-3" />
                    <div className="h-4 w-80 bg-white/5 rounded-md" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex flex-col rounded-xl overflow-hidden border border-white/10 bg-white/5 animate-pulse">
                            <div className="aspect-square w-full bg-white/10" />
                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <div className="h-6 w-24 bg-white/10 rounded" />
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-white/10" />
                                        <div className="w-3 h-3 rounded-full bg-white/10" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="h-4 w-12 bg-white/10 rounded" />
                                    <div className="h-4 w-16 bg-white/10 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}