import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"
import type { ROLE } from "@prisma/client"

const { auth } = NextAuth(authConfig)

const ROLE_PERMISSIONS: Record<string, ROLE[]> = {
    "/admin/users":   ["Vlasnik", "Programer"],
    "/admin/logs":    ["Vlasnik", "Programer"],
    "/admin/sekcije": ["Vlasnik", "Programer"],
}

const protectedRoutes = ["/account"]

export default auth((req) => {
    const { pathname } = req.nextUrl
    const session = req.auth

    if (protectedRoutes.some(r => pathname.startsWith(r))) {
        if (!session) return NextResponse.redirect(new URL("/login", req.nextUrl))
        return NextResponse.next()
    }

    if (!session) {
        return NextResponse.redirect(new URL("/login", req.nextUrl))
    }

    const role = session.user?.role as ROLE

    if (!role || !["Moderator", "Vlasnik", "Programer"].includes(role)) {
        return NextResponse.redirect(new URL("/", req.nextUrl))
    }

    for (const [path, roles] of Object.entries(ROLE_PERMISSIONS)) {
        if (pathname.startsWith(path) && !roles.includes(role)) {
            return NextResponse.redirect(new URL("/admin", req.nextUrl))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/admin/:path*", "/account/:path*"],
}