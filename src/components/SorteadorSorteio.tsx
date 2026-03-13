"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  getParticipants,
  createDraw,
  type ParticipantItem,
} from "@/app/actions/participants";

const CHIP_COLORS = [
  "bg-pink-100 text-pink-800",
  "bg-amber-100 text-amber-800",
  "bg-emerald-100 text-emerald-800",
  "bg-sky-100 text-sky-800",
  "bg-violet-100 text-violet-800",
] as const;

type Props = {
  initialParticipants?: ParticipantItem[];
};

export default function SorteadorSorteio({ initialParticipants = [] }: Props) {
  const [participants, setParticipants] = useState<ParticipantItem[]>(
    () => initialParticipants
  );
  const [refetching, setRefetching] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinPreview, setSpinPreview] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchParticipants = useCallback(async () => {
    setRefetching(true);
    const result = await getParticipants();
    if (result.success) {
      setParticipants(result.participants);
    }
    setRefetching(false);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleSortear = useCallback(() => {
    if (participants.length === 0) return;
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    const duration = 2500;
    const start = Date.now();
    let lastIndex = -1;
    const participantsSnapshot = participants;

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const idx = Math.floor(easeOut * participantsSnapshot.length) % participantsSnapshot.length;
      const safeIdx = idx >= participantsSnapshot.length ? 0 : idx;

      if (safeIdx !== lastIndex) {
        lastIndex = safeIdx;
        setSpinPreview(participantsSnapshot[safeIdx].name);
      }

      if (progress >= 1 && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        const finalIdx = Math.floor(Math.random() * participantsSnapshot.length);
        const winnerParticipant = participantsSnapshot[finalIdx];
        setWinner(winnerParticipant.name);
        setSpinPreview(null);
        setIsSpinning(false);

        createDraw(
          participantsSnapshot.map((p) => p.id),
          winnerParticipant.id
        );
      }
    }, 80);
  }, [participants, isSpinning]);

  const canSortear = participants.length > 0 && !isSpinning;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-orange-600 md:text-3xl">
            Realizar Sorteio
          </h1>
          <p className="mt-1 text-sm text-orange-500/90">
            Participantes cadastrados via QR Code
          </p>
        </div>
        <a
          href="/participar"
          className="rounded-[12px] bg-orange-100 px-3 py-1.5 text-sm font-medium text-orange-700 transition hover:bg-orange-200"
        >
          Participar
        </a>
      </header>

      {participants.length === 0 ? (
        <section className="rounded-[20px] border border-orange-200/60 border-dashed bg-white/50 p-8 text-center">
          <p className="text-orange-600/80">
            Nenhum participante cadastrado ainda.
          </p>
          <p className="mt-1 text-sm text-orange-500/70">
            As participantes devem escanear o QR Code e cadastrar o nome em{" "}
            <a href="/participar" className="font-medium underline">
              /participar
            </a>
          </p>
        </section>
      ) : (
        <>
          <section className="rounded-[20px] border border-orange-200/60 bg-white p-5 shadow-[0_4px_16px_rgba(251,146,60,0.12)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-orange-700/80">
                {participants.length} participante
                {participants.length !== 1 ? "s" : ""}
              </span>
              <button
                type="button"
                onClick={fetchParticipants}
                disabled={refetching}
                className="rounded-[12px] px-2.5 py-1 text-sm text-orange-600/80 transition hover:bg-orange-100 hover:text-orange-700"
              >
                Atualizar
              </button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {participants.map((p, i) => (
                <li
                  key={p.id}
                  className={`rounded-[14px] py-2 pl-3 pr-2 ${CHIP_COLORS[i % CHIP_COLORS.length]}`}
                >
                  <span className="text-sm font-medium">{p.name}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-5">
            <button
              type="button"
              onClick={handleSortear}
              disabled={!canSortear}
              className="rounded-[20px] bg-linear-to-r from-orange-400 via-amber-400 to-amber-500 px-8 py-4 text-lg font-bold text-white shadow-[0_6px_20px_rgba(251,146,60,0.45)] transition hover:from-orange-500 hover:via-amber-500 hover:to-amber-600 hover:shadow-[0_8px_24px_rgba(251,146,60,0.5)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
            >
              {isSpinning ? "Sorteando..." : "🎲 Sortear"}
            </button>

            <div className="flex min-h-[140px] flex-col items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#FB923C_0%,#F59E0B_50%,#EAB308_100%)] px-6 py-8 shadow-[0_6px_20px_rgba(251,146,60,0.3)]">
              {winner ? (
                <p
                  key={winner}
                  className="animate-pop-in text-center text-2xl font-bold text-white drop-shadow-md md:text-4xl"
                >
                  🎉 {winner} 🎉
                </p>
              ) : spinPreview ? (
                <p className="animate-pulse text-center text-xl font-semibold text-white/90 md:text-2xl">
                  {spinPreview}
                </p>
              ) : (
                <p className="text-center text-sm text-white/70">
                  O nome sorteado aparecerá aqui
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
