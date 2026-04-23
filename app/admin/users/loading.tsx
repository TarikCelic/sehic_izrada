export default function AdminProductsLoading() {
    return (
        <div className="p-4 sm:p-6 animate-pulse">
            <div className="mb-6">
                <div className="h-8 w-40 bg-zinc-200 rounded-md mb-2" />
                <div className="h-4 w-60 bg-zinc-100 rounded-md" />
            </div>

            <div className="hidden sm:block bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <th key={i} className="px-4 py-4 border-r border-zinc-100 last:border-r-0">
                                <div className="h-3 w-16 bg-zinc-200 rounded mx-auto" />
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {[...Array(3)].map((_, i) => (
                        <tr key={i} className="border-b border-zinc-100 last:border-b-0">
                            <td className="py-5 border-r border-zinc-100">
                                <div className="h-4 w-58 bg-amber-100 rounded mx-auto" />
                            </td>
                            <td className="px-4 py-3.5 border-r border-zinc-100">
                                <div className="w-9 h-9 rounded-md bg-zinc-100 mx-auto" />
                            </td>
                            <td className="px-4 py-3.5 border-r border-zinc-100">
                                <div className="h-4 w-32 bg-zinc-200 rounded" />
                            </td>
                            <td className="px-4 py-3.5 border-r border-zinc-100">
                                <div className="h-4 w-16 bg-zinc-100 rounded mx-auto" />
                            </td>
                            <td className="px-4 py-3.5 border-r border-zinc-100">
                                <div className="h-4 w-20 bg-zinc-100 rounded mx-auto" />
                            </td>
                            <td className="px-4 py-3.5">
                                <div className="flex justify-center gap-4">
                                    <div className="w-5 h-5 bg-red-100 rounded" />
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="sm:hidden space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-md bg-zinc-100 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-24 bg-zinc-200 rounded" />
                                <div className="h-3 w-16 bg-zinc-100 rounded" />
                            </div>
                            <div className="h-4 w-14 bg-zinc-200 rounded" />
                        </div>
                        <div className="flex items-center justify-between border-t border-zinc-50 pt-3">
                            <div className="h-3 w-20 bg-amber-50 rounded" />
                            <div className="flex gap-4">
                                <div className="w-4 h-4 bg-red-50 rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}