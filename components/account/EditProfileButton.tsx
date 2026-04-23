'use client'
import { useState } from 'react'
import EditProfile from '@/components/account/EditProfile'
import Link from "next/link";

export default function AccountClient({ user }: { user: { name: string | null, email: string } }) {
    const [editOpen, setEditOpen] = useState(false)

    return (
        <>
            {editOpen && (
                <EditProfile
                    initialName={user.name ?? ''}
                    initialEmail={user.email}
                    onClose={() => setEditOpen(false)}
                />
            )}
            <div
                onClick={() => setEditOpen(true)}
                className="cursor-pointer flex items-center gap-1.5 text-sm border border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors rounded-md px-3 py-1.5 shrink-0"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                <span className="hidden sm:inline">Uredi profil</span>
                <span className="sm:hidden">Uredi</span>
            </div>
        </>
    )
}