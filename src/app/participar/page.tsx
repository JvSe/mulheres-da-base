"use client";

import { useState } from "react";
import Link from "next/link";
import { registerParticipant } from "@/app/actions/participants";

export default function ParticiparPage() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    const result = await registerParticipant(name.trim());
    if (result.success) {
      setStatus("success");
      setName("");
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Erro ao cadastrar");
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#FFE4E6_0%,#FFF1E6_35%,#FEF3C7_70%,#D1FAE5_100%)] px-4 py-12">
      <div className="mx-auto max-w-md rounded-[28px] bg-white/90 p-6 shadow-[0_8px_32px_rgba(251,146,60,0.15)] backdrop-blur-sm md:p-8">
        <div className="flex flex-col gap-6">
          <header>
            <h1 className="text-2xl font-bold tracking-tight text-orange-600 md:text-3xl">
              Participar do Sorteio
            </h1>
            <p className="mt-1 text-sm text-orange-500/90">
              Cadastre seu nome para participar
            </p>
          </header>

          {status === "success" ? (
            <div className="rounded-[20px] bg-emerald-50 p-6 text-center">
              <p className="text-2xl">✅</p>
              <p className="mt-2 font-semibold text-emerald-800">
                Cadastro realizado com sucesso!
              </p>
              <p className="mt-1 text-sm text-emerald-600">
                Você já está participando do sorteio.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-4 rounded-[16px] bg-emerald-500 px-4 py-2 font-medium text-white transition hover:bg-emerald-600"
              >
                Cadastrar outro nome
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-orange-700/80">
                  Seu nome
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome"
                  disabled={status === "loading"}
                  className="w-full rounded-[16px] border border-orange-200 bg-orange-50/50 px-4 py-3 text-orange-900 placeholder-orange-400/70 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-300/50 disabled:opacity-60"
                  autoFocus
                />
              </div>
              {status === "error" ? (
                <p className="text-sm text-red-600">{errorMsg}</p>
              ) : null}
              <button
                type="submit"
                disabled={status === "loading" || !name.trim()}
                className="w-full rounded-[16px] bg-linear-to-r from-orange-400 to-amber-400 px-4 py-3 font-semibold text-white shadow-[0_4px_14px_rgba(251,146,60,0.4)] transition hover:from-orange-500 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "loading" ? "Cadastrando..." : "Participar"}
              </button>
            </form>
          )}

          <p className="text-center text-xs text-orange-500/70">
            <Link href="/sorteio" className="underline hover:text-orange-600">
              Área do sorteio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
