export default function LightLoading() {
    return (
        <section className="min-h-screen w-full py-20 px-6 md:px-12 bg-gray-50 flex gap-10">

            <div className="flex-1 flex flex-col">
                <div className="animate-pulse mb-10">
                    <div className="h-10 w-64 bg-gray-300 rounded-lg mb-3" />
                    <div className="h-4 w-80 bg-gray-200 rounded-md" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm animate-pulse">

                            <div className="aspect-square w-full bg-gray-100" />

                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <div className="h-6 w-24 bg-gray-200 rounded" />
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-gray-200" />
                                        <div className="w-3 h-3 rounded-full bg-gray-200" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="h-4 w-12 bg-gray-200 rounded" />
                                    <div className="h-4 w-16 bg-gray-100 border border-gray-200 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}