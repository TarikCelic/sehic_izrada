
export default function AdminLoading() {
    return (
        <section className="flex flex-col gap-8 p-4 sm:p-6 animate-pulse">

            <div>
                <div className="h-8 w-48 bg-gray-200 rounded-md mb-2" />
                <div className="h-4 w-64 bg-gray-100 rounded-md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-3 bg-black/5 px-4 py-6 rounded-sm border-l-4 border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="h-5 w-24 bg-gray-200 rounded" />
                            <div className="h-7 w-10 bg-gray-300 rounded" />
                        </div>
                        <div className="h-3 w-32 bg-gray-100 rounded" />
                    </div>
                ))}
            </div>

            <div className="flex flex-col w-full rounded-2xl overflow-hidden border border-gray-100">
                <div className="bg-black/5 flex items-center w-full px-4 py-3 border-b border-black/10">
                    <div className="w-20 h-3 bg-gray-200 rounded shrink-0 mr-4" />
                    <div className="flex-1 h-3 bg-gray-200 rounded min-w-[150px] mr-4" />
                    <div className="w-32 hidden md:block h-3 bg-gray-200 rounded shrink-0 mr-4" />
                    <div className="w-20 h-3 bg-gray-200 rounded shrink-0 ml-auto" />
                </div>

                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center w-full px-4 py-4 border-b border-gray-100">
                        <div className="w-20 h-4 bg-gray-100 rounded shrink-0 mr-4" />
                        <div className="flex-1 h-4 bg-gray-200 rounded min-w-[150px] mr-4" />
                        <div className="w-32 hidden md:block h-4 bg-gray-100 rounded shrink-0 mr-4" />
                        <div className="w-20 h-4 bg-gray-200 rounded shrink-0 ml-auto" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {[...Array(2)].map((_, chartIdx) => (
                    <div key={chartIdx} className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div className="h-4 w-40 bg-gray-200 rounded" />
                            <div className="h-3 w-24 bg-gray-100 rounded" />
                        </div>

                        <div className="space-y-6">
                            {[...Array(5)].map((_, rowIdx) => (
                                <div key={rowIdx} className="space-y-2">
                                    <div className="flex justify-between">
                                        <div className="h-3 w-20 bg-gray-100 rounded" />
                                        <div className="h-3 w-16 bg-gray-100 rounded" />
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}