"use client";

import Link from "next/link";
import { createMessage } from "@/lib/admin/actions";
import React, { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      await createMessage(formData);
      setSuccess(true);
    } catch {
      setError("Došlo je do greške. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <section className="min-h-screen w-full bg-(--foreground) flex items-center justify-center py-20 px-4 sm:px-8 md:px-12 lg:px-24 overflow-x-hidden">
        <div className="max-w-6xl w-full flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-20">

          <div className="flex flex-col text-center lg:text-left items-center lg:items-start gap-8 animate-fade-left">
            <div className="space-y-4 mt-6">
              <h1 className="text-(--primary) text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-sekuya uppercase tracking-tighter leading-none">
                Započnimo <br className="hidden lg:block" /> projekt
              </h1>
              <p className="text-white/60 text-base sm:text-lg max-w-sm mx-auto lg:mx-0 font-light leading-relaxed">
                Imate ideju za unikatan komad namještaja? Pišite nam i pretvorimo
                vašu viziju u stvarnost.
              </p>
            </div>

            <div className="w-full space-y-6 md:space-y-8">
              <div className="group">
                <p className="text-(--primary) text-[10px] uppercase tracking-[0.3em] mb-1 opacity-50">E-mail</p>
                <Link
                    href="mailto:sehic.senaid@gmail.com"
                    className="text-white text-lg sm:text-xl md:text-2xl break-all hover:text-(--primary) transition-colors border-b border-transparent hover:border-(--primary)"
                >
                  sehic.senaid@gmail.com
                </Link>
              </div>

              <div className="group">
                <p className="text-(--primary) text-[10px] uppercase tracking-[0.3em] mb-1 opacity-50">Telefon</p>
                <Link
                    href="tel:+38761159744"
                    className="text-white text-lg sm:text-xl md:text-2xl hover:text-(--primary) transition-colors"
                >
                  +387 61 159 744
                </Link>
              </div>

              <div className="group">
                <p className="text-(--primary) text-[10px] uppercase tracking-[0.3em] mb-1 opacity-50">Lokacija</p>
                <p className="text-white text-lg sm:text-xl md:text-2xl leading-tight">
                  Gornji Vakuf - Uskoplje, <br /> Bosna i Hercegovina
                </p>
              </div>
            </div>
          </div>

          <div className="w-full bg-white/[0.02] border border-white/10 p-6 sm:p-8 md:p-10 rounded-lg shadow-2xl animate-fade-right overflow-hidden">

            {success ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-(--primary)/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-(--primary)" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white text-xl font-bold">Poruka poslana!</p>
                    <p className="text-white/50 text-sm">Javit ćemo vam se u najkraćem roku.</p>
                  </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-6 sm:grid sm:grid-cols-2 sm:gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="ime" className="text-[10px] uppercase tracking-widest text-white/40">
                        Ime i prezime
                      </label>
                      <input
                          id="ime"
                          name="ime"
                          type="text"
                          required
                          placeholder="Vaše ime..."
                          disabled={loading}
                          className="bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-(--primary) transition-all placeholder:text-white/10 disabled:opacity-40"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-white/40">
                        E-mail adresa
                      </label>
                      <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="vaš@email.com"
                          disabled={loading}
                          className="bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-(--primary) transition-all placeholder:text-white/10 disabled:opacity-40"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <label htmlFor="poruka" className="text-[10px] uppercase tracking-widest text-white/40">
                      Vaša poruka
                    </label>
                    <textarea
                        id="poruka"
                        name="poruka"
                        rows={3}
                        required
                        placeholder="Opišite vaš projekt..."
                        disabled={loading}
                        className="bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-(--primary) transition-all resize-none placeholder:text-white/10 disabled:opacity-40"
                    />
                  </div>

                  {error && (
                      <p className="text-red-400 text-xs tracking-wide">{error}</p>
                  )}

                  <button
                      type="submit"
                      disabled={loading}
                      className={`mt-6 w-full sm:w-auto bg-(--primary) text-(--foreground) font-black uppercase py-4 px-10 tracking-[0.2em] hover:bg-white transition-all duration-300 rounded-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3 ${loading && ' bg-black/80'}`}
                  >Pošalji upit</button>
                </form>
            )}
          </div>
        </div>
      </section>
  );
}