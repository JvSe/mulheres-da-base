import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#FFE4E6_0%,#FFF1E6_35%,#FEF3C7_70%,#D1FAE5_100%)] px-4 py-12">
      <div className="mx-auto max-w-md rounded-[28px] bg-white/90 p-8 shadow-[0_8px_32px_rgba(251,146,60,0.15)] backdrop-blur-sm text-center">
        <h1 className="text-2xl font-bold tracking-tight text-orange-600 md:text-3xl">
          Sorteador de Nomes
        </h1>
        <p className="mt-2 text-sm text-orange-500/90">
          Mulheres da Base — Sorteio
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/participar"
            className="rounded-[16px] bg-linear-to-r from-orange-400 to-amber-400 px-6 py-3 font-semibold text-white shadow-[0_4px_14px_rgba(251,146,60,0.4)] transition hover:from-orange-500 hover:to-amber-500"
          >
            Participar do sorteio
          </Link>
          <Link
            href="/sorteio"
            className="rounded-[16px] border-2 border-orange-300 bg-white px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-50"
          >
            Realizar sorteio
          </Link>
        </div>
      </div>
    </div>
  );
}
