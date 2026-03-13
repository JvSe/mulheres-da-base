"use client";

import { useState, useCallback } from "react";

function parseNames(text: string): string[] {
  return text
    .split(/[\n,;]/)
    .map((n) => n.trim())
    .filter(Boolean);
}

const CHIP_COLORS = [
  "bg-pink-100 text-pink-800",
  "bg-amber-100 text-amber-800",
  "bg-emerald-100 text-emerald-800",
  "bg-sky-100 text-sky-800",
  "bg-violet-100 text-violet-800",
] as const;

export default function Sorteador() {
  const [namesText, setNamesText] = useState("");
  const [names, setNames] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinPreview, setSpinPreview] = useState<string | null>(null);

  const handleAddNames = useCallback(() => {
    const parsed = parseNames(namesText);
    if (parsed.length) {
      setNames((prev) => [...prev, ...parsed]);
      setNamesText("");
    }
  }, [namesText]);

  const handleRemoveName = useCallback((index: number) => {
    setNames((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClear = useCallback(() => {
    setNames([]);
    setWinner(null);
    setSpinPreview(null);
    setNamesText("");
  }, []);

  const handleSortear = useCallback(() => {
    if (names.length === 0) return;
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    const duration = 2500;
    const start = Date.now();
    let lastIndex = -1;
    const namesSnapshot = names;

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const idx = Math.floor(easeOut * namesSnapshot.length) % namesSnapshot.length;
      const safeIdx = idx >= namesSnapshot.length ? 0 : idx;

      if (safeIdx !== lastIndex) {
        lastIndex = safeIdx;
        setSpinPreview(namesSnapshot[safeIdx]);
      }

      if (progress >= 1) {
        clearInterval(interval);
        const finalIdx = Math.floor(Math.random() * namesSnapshot.length);
        setWinner(namesSnapshot[finalIdx]);
        setSpinPreview(null);
        setIsSpinning(false);
      }
    }, 80);
  }, [names, isSpinning]);

  const canSortear = names.length > 0 && !isSpinning;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-orange-600 md:text-3xl">
          Sorteador de Nomes
        </h1>
        <p className="mt-1 text-sm text-orange-500/90">
          Adicione os nomes e sorteie de forma aleatória
        </p>
      </header>

      <section className="rounded-[20px] border border-orange-200/60 bg-white p-5 shadow-[0_4px_16px_rgba(251,146,60,0.12)]">
        <label className="mb-2 block text-sm font-medium text-orange-700/80">
          Nomes (um por linha ou separados por vírgula)
        </label>
        <textarea
          value={namesText}
          onChange={(e) => setNamesText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAddNames()}
          placeholder={"Maria\nJoão\nPedro\nAna\n..."}
          rows={4}
          className="w-full resize-none rounded-[16px] border border-orange-200 bg-orange-50/50 px-4 py-3 text-orange-900 placeholder-orange-400/70 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-300/50"
        />
        <button
          type="button"
          onClick={handleAddNames}
          disabled={!namesText.trim()}
          className="mt-4 w-full rounded-[16px] bg-linear-to-r from-orange-400 to-amber-400 px-4 py-3 font-semibold text-white shadow-[0_4px_14px_rgba(251,146,60,0.4)] transition hover:from-orange-500 hover:to-amber-500 hover:shadow-[0_4px_18px_rgba(251,146,60,0.5)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          Adicionar à lista
        </button>
      </section>

      {names.length > 0 ? (
        <section className="rounded-[20px] border border-orange-200/60 bg-white p-5 shadow-[0_4px_16px_rgba(251,146,60,0.12)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-orange-700/80">
              {names.length} nome{names.length !== 1 ? "s" : ""} na lista
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-[12px] px-2.5 py-1 text-sm text-orange-600/80 transition hover:bg-orange-100 hover:text-orange-700"
            >
              Limpar tudo
            </button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {names.map((name, i) => (
              <li
                key={`${name}-${i}`}
                className={`group flex items-center gap-1 rounded-[14px] py-2 pl-3 pr-1 ${CHIP_COLORS[i % CHIP_COLORS.length]}`}
              >
                <span className="text-sm font-medium">
                  {name}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveName(i)}
                  aria-label={`Remover ${name}`}
                  className="rounded-lg p-1 opacity-70 transition hover:opacity-100"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

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
    </div>
  );
}
