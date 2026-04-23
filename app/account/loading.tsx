export default function Loading() {
    return (
        <section className="mt-16 flex min-h-[calc(100vh-4rem)] justify-center items-start sm:items-center px-4 py-8 relative ">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-[0px_8px_24px_rgba(149,157,165,0.1)] flex flex-col p-4 sm:p-6 gap-4 animate-pulse">

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 border border-gray-100 p-4 rounded-xl">
                    <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-gray-200 shrink-0" />
                    <div className="flex justify-between w-full items-center gap-3">
                        <div className="flex flex-col gap-2 min-w-0 w-full">
                            <div className="h-5 bg-gray-200 rounded w-32" />
                            <div className="h-4 bg-gray-200 rounded w-48" />
                        </div>
                        <div className="h-10 w-24 bg-gray-200 rounded-lg shrink-0" />
                    </div>
                </div>

                <div className="flex items-center justify-center border border-gray-100 border-dashed flex-col min-h-[200px] sm:min-h-[260px] rounded-xl p-2 w-full">
                    <div className="overflow-x-auto w-full">
                        <div className="grid grid-flow-col auto-cols-[180px] gap-3 p-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex flex-col border border-gray-100 rounded-xl overflow-hidden">
                                    <div className="w-48 h-48 bg-gray-200" />
                                    <div className="p-4 gap-2 flex flex-col">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 border border-gray-100 p-4 rounded-xl">
                    <div className="h-10 w-full sm:w-32 bg-gray-200 rounded-md" />
                    <div className="h-10 w-full sm:w-40 bg-gray-200 rounded-md sm:ml-auto" />
                </div>

            </div>
        </section>
    );
}