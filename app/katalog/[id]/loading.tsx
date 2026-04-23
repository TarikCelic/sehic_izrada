export default function ProductDetailsLoading() {
    return (
        <div className="min-h-screen bg-[var(--foreground)] pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">

                <div className="mb-8 flex items-center gap-2">
                    <div className="h-3 w-16 bg-white/10 rounded" />
                    <div className="h-3 w-2 bg-white/5" />
                    <div className="h-3 w-32 bg-white/10 rounded" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 relative">

                    <div className="flex flex-col-reverse sm:flex-row gap-3">
                        <div className="flex sm:flex-col gap-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-lg shrink-0" />
                            ))}
                        </div>
                        <div className="flex-1 bg-white/10 rounded-2xl w-full" />
                    </div>

                    <div className="flex flex-col gap-6">

                        <div className="h-6 w-24 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-full" />

                        <div className="space-y-4">
                            <div className="h-10 sm:h-12 w-3/4 bg-white/10 rounded-md" />
                            <div className="h-8 w-32 bg-[var(--primary)]/20 rounded-md" />
                        </div>

                        <div className="h-px bg-white/10 w-full" />

                        <div className="space-y-3">
                            <div className="h-3 w-28 bg-white/10 rounded" />
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-white/5 rounded" />
                                <div className="h-4 w-full bg-white/5 rounded" />
                                <div className="h-4 w-2/3 bg-white/5 rounded" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <div className="h-3 w-24 bg-white/10 rounded" />
                                <div className="h-5 w-32 bg-white/5 rounded" />
                            </div>

                            <div className="space-y-3">
                                <div className="h-3 w-28 bg-white/10 rounded" />
                                <div className="flex gap-3">
                                    <div className="w-7 h-7 rounded-full bg-white/10" />
                                    <div className="w-7 h-7 rounded-full bg-white/10" />
                                    <div className="w-7 h-7 rounded-full bg-white/10" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-3 w-20 bg-white/10 rounded" />
                            <div className="h-5 w-full bg-white/5 rounded" />
                        </div>

                        <div className="h-px bg-white/10 w-full" />

                        <div className="flex gap-3 mt-4">
                            <div className="h-14 flex-1 bg-white/10 rounded-xl" />
                            <div className="h-14 w-14 bg-white/10 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}