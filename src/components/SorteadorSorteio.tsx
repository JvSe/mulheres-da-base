"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  getParticipantsForRaffle,
  createDrawForRaffle,
} from "@/app/actions/participants";
import type { ParticipantItem } from "@/lib/participants-server";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BADGE_VARIANTS = [
  "default",
  "secondary",
  "outline",
] as const;

type Props = {
  raffleId: string;
  initialParticipants?: ParticipantItem[];
};

export default function SorteadorSorteio({ raffleId, initialParticipants = [] }: Props) {
  const [participants, setParticipants] = useState<ParticipantItem[]>(() => initialParticipants);
  const [winners, setWinners] = useState<ParticipantItem[]>([]);
  const [usedWinnerIds, setUsedWinnerIds] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinPreview, setSpinPreview] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    data,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["raffle-participants", raffleId],
    queryFn: async () => {
      const result = await getParticipantsForRaffle(raffleId);
      return result.success ? result : { participants: initialParticipants, usedWinnerIds: [] };
    },
    initialData: { participants: initialParticipants, usedWinnerIds: [] },
    refetchInterval: 5000,
  });

  const liveParticipants = data?.participants ?? initialParticipants;
  const liveUsedWinnerIds = data?.usedWinnerIds ?? [];

  useEffect(() => {
    setParticipants(liveParticipants);
    setUsedWinnerIds(liveUsedWinnerIds);
  }, [liveParticipants, liveUsedWinnerIds]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleSortear = useCallback(() => {
    const available = participants.filter((p) => !usedWinnerIds.includes(p.id));
    if (available.length === 0) return;
    if (isSpinning) return;

    setIsSpinning(true);
    setWinners([]);

    const duration = 2500;
    const start = Date.now();
    let lastIndex = -1;
    const participantsSnapshot = available;

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
        const count = Math.min(5, participantsSnapshot.length);
        const picked: ParticipantItem[] = [];
        const usedLocal = new Set<string>();
        while (picked.length < count) {
          const idx = Math.floor(Math.random() * participantsSnapshot.length);
          const candidate = participantsSnapshot[idx];
          if (!usedLocal.has(candidate.id)) {
            usedLocal.add(candidate.id);
            picked.push(candidate);
          }
        }
        setWinners(picked);
        setUsedWinnerIds((prev) => [...prev, ...picked.map((p) => p.id)]);
        setSpinPreview(null);
        setIsSpinning(false);

        picked.forEach((winnerParticipant) => {
          void createDrawForRaffle(
            raffleId,
            participants.map((p) => p.id),
            winnerParticipant.id
          );
        });
      }
    }, 80);
  }, [participants, usedWinnerIds, isSpinning, raffleId]);

  const canSortear = participants.some((p) => !usedWinnerIds.includes(p.id)) && !isSpinning;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-row flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-medium leading-tight md:text-3xl">
            Realizar Sorteio
          </h2>
          <p className="text-base text-muted-foreground">
            Participantes cadastrados via QR Code
          </p>
        </div>
      </header>

      {participants.length === 0 ? (
        <Card className="border-dashed">
            <CardContent className="flex flex-col gap-3 p-8 text-center">
            <p className="text-base text-muted-foreground">
              Nenhum participante cadastrado ainda.
            </p>
            <p className="text-base text-muted-foreground">
              As participantes devem escanear o QR Code e cadastrar o nome em{" "}
              <Button variant="link" size="sm" className="p-0 h-auto font-medium" asChild>
                <Link href="/participar">/participar</Link>
              </Button>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-5">
          <Card className="min-h-[160px] bg-[linear-gradient(135deg,#fce7f3_0%,#fef3c7_45%,#e0f2fe_100%)] text-rose-900">
            <CardContent className="flex min-h-[160px] flex-col items-center justify-center gap-3 py-6 px-4 sm:py-8 sm:px-8">
              {winners.length ? (
                <div className="flex flex-col items-center gap-2">
                  {winners.map((w) => (
                    <p
                      key={w.id}
                      className="animate-pop-in text-center text-xl font-bold md:text-3xl"
                    >
                      ✨ {w.name} ✨
                    </p>
                  ))}
                </div>
              ) : spinPreview ? (
                <p className="animate-pulse text-center text-xl font-semibold opacity-90 md:text-2xl">
                  {spinPreview}
                </p>
              ) : (
                <p className="text-center text-sm opacity-80">
                  O nome sorteado aparecerá aqui assim que o sorteio for realizado.
                </p>
              )}
            </CardContent>
          </Card>

          <Button
            type="button"
            size="lg"
            className="w-full text-lg font-semibold bg-linear-to-r from-pink-400 via-rose-400 to-amber-300 text-white shadow-[0_4px_18px_rgba(244,114,182,0.45)] hover:from-pink-500 hover:via-rose-500 hover:to-amber-400"
            onClick={handleSortear}
            disabled={!canSortear}
          >
            {isSpinning ? "Sorteando..." : "Sortear"}
          </Button>

          <Card className="border-rose-100 bg-rose-50/60">
            <CardContent className="flex flex-col gap-3 pt-4 px-3 sm:pt-6 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-base font-medium text-muted-foreground">
                  {participants.length} participante
                  {participants.length !== 1 ? "s" : ""}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="text-rose-500 hover:bg-rose-50"
                >
                  {isFetching ? "Atualizando..." : "Atualizar lista"}
                </Button>
              </div>
              <ul className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1 sm:max-h-56">
                {participants.map((p, i) => (
                  <Badge
                    key={p.id}
                    variant={BADGE_VARIANTS[i % BADGE_VARIANTS.length]}
                    className="py-1.5 px-3"
                  >
                    {p.name}
                  </Badge>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
