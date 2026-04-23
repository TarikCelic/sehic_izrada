import Link from "next/link";
import {prisma} from "@/lib/prisma"
import { auth } from "@/lib/auth";
import {redirect} from "next/navigation";
import Image from "next/image"
import AccClient from "@/components/account/EditProfileButton"
import LogoutButton from "@/components/account/LogoutButton";

const Page = async () => {

    const session = await auth();
    const userId = session?.user?.id;

    if (!session ) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { id: userId ?? '' },
        select: {
            name: true,
            email: true,
            image: true,
            role: true,
            favourites: {
                select: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            images: {
                                take: 1,
                                select: { url: true }
                            }
                        }
                    }
                }
            }
        }
    })

    if (!user) {
        redirect('/login');
    }

    const isAdmin = user.role === "Vlasnik" || user.role === "Moderator" || user.role === "Programer"

    return (
        <section className="mt-16 flex min-h-[calc(100vh-6rem)] justify-center items-start sm:items-center px-4 py-8 relative animate-fade">

            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-[0px_8px_24px_rgba(149,157,165,0.2)] flex flex-col p-4 sm:p-6 gap-4">

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 border border-gray-200 p-4 rounded-xl">
                    <div className="aspect-square w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full text-2xl bg-gradient-to-br from-gray-800 to-black text-white flex justify-center items-center font-semibold shrink-0">
                        {user.name?.[0]?.toUpperCase()}
                    </div>

                    <div className="flex justify-between w-full items-center gap-3">
                        <div className="flex flex-col min-w-0">
                            <p className="text-lg font-semibold truncate">{user.name}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>

                        <AccClient user={user} />
                    </div>
                </div>

                <div className="flex items-center justify-center border border-gray-200 border-dashed flex-col min-h-[200px] sm:min-h-[260px] rounded-xl p-2 text-center w-full">
                {user.favourites.length === 0 && (
                        <>
                            <h2 className="text-lg sm:text-xl font-semibold mt-2">Omiljeni proizvodi</h2>
                            <p className="text-sm text-gray-500 mt-1">Nema omiljenih proizvoda</p>
                            <Link
                                href="/katalog"
                                className="mt-4 text-sm px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
                            >
                                Pogledaj katalog
                            </Link>
                        </>
                    )}
                    {user.favourites.length > 0 && (
                        <div className="overflow-x-auto w-full">
                            <div className="grid grid-flow-col auto-cols-[180px] gap-3 p-2">
                                {user.favourites.map(({ product }) => (
                                    <Link href={`/katalog/${product.id}`} key={product.id} className="flex flex-col border border-black/20 rounded-xl overflow-hidden rounded-lg">
                                        <div className={"relative w-48 h-48 aspect-square"}>
                                            <Image alt={"Product Image"} fill src={product.images[0]?.url} className=" object-cover" />
                                        </div>
                                        <div className={"p-4"}>
                                            <p className="font-medium text-left truncate max-w-[16ch]">{product.name}</p>
                                            <p className="text-sm text-gray-500 text-left">{product.price} KM</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 border border-gray-200 p-4 rounded-xl">
                    <LogoutButton />

                    {isAdmin && (
                        <Link
                            href="/admin"
                            className="flex items-center justify-center gap-1.5 text-sm rounded-md bg-black text-white py-2 px-4 hover:bg-gray-800 transition-colors sm:ml-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                            </svg>
                            Admin Dashboard
                        </Link>
                    )}
                </div>

            </div>
        </section>
    )
}

export default Page