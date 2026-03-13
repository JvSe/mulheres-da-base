import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listMyRaffles, createRaffle } from "@/app/actions/raffles";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { raffles } = await listMyRaffles();

  async function handleCreate(formData: FormData) {
    "use server";
    const name = String(formData.get("name") ?? "");
    await createRaffle({ name });
    redirect("/dashboard");
  }

  return (
    <div className="min-h-svh bg-[linear-gradient(160deg,#FFE4E6_0%,#FFF1E6_35%,#FEF3C7_70%,#D1FAE5_100%)] px-4 py-10 flex items-center justify-center">
      <Card className="w-full flex max-w-3xl flex-col gap-6 rounded-[28px] bg-white/90 p-6 shadow-[0_8px_32px_rgba(251,146,60,0.15)] backdrop-blur-sm md:p-8">
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="text-2xl md:text-3xl">
            Meus sorteios
          </CardTitle>
          <CardDescription>
            Crie e gerencie os sorteios que você irá conduzir.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-muted-foreground">
              Criar novo sorteio
            </h2>
            <form action={handleCreate} className="flex flex-col gap-3 md:flex-row">
              <Input
                name="name"
                placeholder="Nome do sorteio (ex: Primeiro sorteio)"
                className="h-11 rounded-2xl bg-white/80"
                required
              />
              <Button
                type="submit"
                className="h-11 bg-linear-to-r from-orange-400 to-amber-400 text-white shadow-[0_4px_14px_rgba(251,146,60,0.4)] hover:from-orange-500 hover:to-amber-500"
              >
                Criar sorteio
              </Button>
            </form>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              Sorteios cadastrados
            </h2>
            {raffles.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Você ainda não criou nenhum sorteio. Comece criando um acima.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {raffles.map((raffle) => (
                  <details
                    key={raffle.id}
                    className="group rounded-2xl border border-orange-100 bg-white/80 px-4 py-3 shadow-sm transition-colors open:bg-orange-50/60"
                  >
                    <summary className="flex cursor-pointer list-none flex-col gap-1 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium">{raffle.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Código: <span className="font-mono">{raffle.slug}</span>
                        </p>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground md:mt-0">
                        <span>
                          {raffle.participantsCount} participante
                          {raffle.participantsCount === 1 ? "" : "s"}
                        </span>
                        <span>•</span>
                        <span>
                          {raffle.drawsCount} sorteio
                          {raffle.drawsCount === 1 ? "" : "s"} realizado
                        </span>
                      </div>
                    </summary>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/sorteios/${raffle.slug}`}>
                          Abrir área do sorteio
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/participar/${raffle.slug}`}>
                          Link de participação
                        </Link>
                      </Button>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

