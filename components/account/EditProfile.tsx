'use client'

import {useEffect, useState} from 'react'
import { updateProfile } from '@/lib/user/actions'
import { createPortal } from 'react-dom'

type Props = {
    initialName: string
    initialEmail: string
    onClose: () => void
}

const EditProfile = ({ initialName, initialEmail, onClose }: Props) => {
    const [name, setName] = useState(initialName)
    const [email, setEmail] = useState(initialEmail)
    const [newPassword, setNewPassword] = useState('')

    const [showConfirm, setShowConfirm] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false)

    const hasChanges =
        name !== initialName ||
        email !== initialEmail ||
        newPassword.length > 0

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!hasChanges) return
        setShowConfirm(true)
        setError('')
    }

    const handleConfirm = async () => {
        if (!currentPassword) {
            setError('Unesi trenutnu lozinku')
            return
        }
        setLoading(true)
        const result = await updateProfile({ name, email, newPassword, currentPassword })
        setLoading(false)

        if (result?.error) {
            setError(result.error)
        } else {
            setShowConfirm(false)
            onClose()
        }
    }


    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true))
    }, [])

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            onClose()
        }, 200)
    }

    return createPortal(
        <div className={`fixed inset-0 z-[50] bg-black/50 flex justify-center items-center 
    transition-opacity duration-200 
    ${isClosing || !isVisible ? 'opacity-0' : 'opacity-100'}`}>

            <div
                className={`bg-white flex flex-col p-6 rounded-lg gap-4 w-full max-w-md mx-4
    transition-all duration-200 ease-in-out
    ${isClosing || !isVisible
                    ? 'opacity-0 translate-y-4'
                    : 'opacity-100 translate-y-0'
                }`}
            >
                {!showConfirm ? (
                    <>
                        <div className="flex mb-2 justify-between items-center ">
                            <p className="text-xl font-bold">Uredi profil</p>
                            <button
                                onClick={handleClose}
                                className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all text-2xl"
                            >
                                ×
                            </button>
                        </div>


                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">Ime</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Ime"
                                    className="border p-2 border-black/10 border-2 outline-none focus:border-black/50 transition-all duration-200"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Email"
                                    className="border p-2 border-black/10 border-2 outline-none focus:border-black/50 transition-all duration-200"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">Nova lozinka <span className="text-gray-400">(ostavi prazno ako ne mijenjаš)</span></label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="Nova lozinka"
                                    className="border p-2 border-black/10 border-2 outline-none focus:border-black/50 transition-all duration-200"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!hasChanges}
                                className="cursor-pointer bg-black p-3 text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
                            >
                                Ažuriraj profil
                            </button>
                        </form>
                    </>
                ) : (
                    <div className={`transition-all duration-200 ease-in-out ${isClosing || !isVisible ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                        <div className="flex mb-2 justify-between items-center">
                            <p className="text-xl font-bold">Potvrdi izmjene</p>
                        </div>
                        <p className="text-sm text-gray-500">Unesi trenutnu lozinku da potvrdiš izmjene.</p>

                        <input
                            type="password"
                            value={currentPassword}
                            onChange={e => { setCurrentPassword(e.target.value); setError('') }}
                            placeholder="Trenutna lozinka"
                            autoFocus
                            className="w-full mb-4 mt-2 border p-2 border-black/10 border-2 outline-none focus:border-black/50 transition-all duration-200"
                        />

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <div className="flex gap-2">
                            <button
                                onClick={() => { setShowConfirm(false); setCurrentPassword(''); setError('') }}
                                className="flex-1 border border-gray-200 py-2 rounded text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Nazad
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className="flex-1 bg-black text-white py-2 rounded text-sm hover:bg-gray-800 transition-colors disabled:opacity-40 cursor-pointer"
                            >
                                {loading ? 'Čekaj...' : 'Potvrdi'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>, document.body)
}

export default EditProfile