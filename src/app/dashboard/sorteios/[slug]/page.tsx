import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getRaffleForOwnerBySlug } from "@/app/actions/raffles";
import { getParticipantsForRaffleCached } from "@/lib/participants-server";
import SorteadorSorteio from "@/components/SorteadorSorteio";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function RaffleAdminPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const raffle = await getRaffleForOwnerBySlug(slug);
  if (!raffle) {
    notFound();
  }

  const initialParticipants = await getParticipantsForRaffleCached(raffle.id);

  return (
    <div className="min-h-svh bg-[linear-gradient(160deg,#FFE4E6_0%,#FFF1E6_35%,#FEF3C7_70%,#D1FAE5_100%)] px-3 py-8 flex items-center justify-center sm:px-4 sm:py-10">
      <Card className="w-full max-w-2xl rounded-[28px] bg-white/90 p-4 shadow-[0_8px_32px_rgba(251,146,60,0.15)] backdrop-blur-sm sm:p-6 md:p-8">
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="text-2xl md:text-3xl">
            {raffle.name}
          </CardTitle>
          <CardDescription>
            Código do sorteio:{" "}
            <span className="font-mono text-xs">{raffle.slug}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/participar/${raffle.slug}`}>Abrir página de participação</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">Voltar para dashboard</Link>
            </Button>
          </div>
          <SorteadorSorteio
            raffleId={raffle.id}
            initialParticipants={initialParticipants}
          />
        </CardContent>
      </Card>
    </div>
  );
}

