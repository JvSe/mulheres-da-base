"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { registerParticipantForRaffle } from "@/app/actions/participants";
import { getRaffleBySlug } from "@/app/actions/raffles";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ParticiparBySlugPage() {
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(params.slug);

  const [raffleName, setRaffleName] = useState<string | null>(null);
  const [raffleId, setRaffleId] = useState<string | null>(null);
  const [loadingRaffle, setLoadingRaffle] = useState(true);

  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingRaffle(true);
      const raffle = await getRaffleBySlug(slug);
      if (cancelled) return;
      if (!raffle) {
        setRaffleName(null);
        setRaffleId(null);
      } else {
        setRaffleName(raffle.name);
        setRaffleId(raffle.id);
      }
      setLoadingRaffle(false);
    }
    if (slug) {
      void load();
    }
    // verifica se já existe cadastro deste dispositivo para este sorteio
    try {
      const key = `raffle:${slug}:participant`;
      const stored = window.localStorage.getItem(key);
      if (stored) {
        setStatus("success");
      }
    } catch {
      // ignore erros de localStorage (modo privado, etc.)
    }
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!raffleId || !name.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    const result = await registerParticipantForRaffle(raffleId, name.trim());
    if (result.success) {
      try {
        const key = `raffle:${slug}:participant`;
        window.localStorage.setItem(
          key,
          JSON.stringify({ name: name.trim(), at: new Date().toISOString() })
        );
      } catch {
        // se localStorage falhar, ainda consideramos o cadastro válido
      }
      setStatus("success");
      setName("");
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Erro ao cadastrar");
    }
  }

  const disabled = loadingRaffle || !raffleId;

  return (
    <div className="min-h-svh bg-[linear-gradient(160deg,#FFE4E6_0%,#FFF1E6_35%,#FEF3C7_70%,#D1FAE5_100%)] px-4 py-10 flex items-center justify-center">
      <Card className="w-full max-w-md rounded-[28px] bg-white/90 p-6 shadow-[0_8px_32px_rgba(251,146,60,0.15)] backdrop-blur-sm md:p-8">
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="text-2xl md:text-3xl">
            {raffleName ?? "Sorteio não encontrado"}
          </CardTitle>
          <CardDescription>
            {raffleName
              ? "Cadastre seu nome para participar deste sorteio. Depois é só aguardar o sorteio ser realizado."
              : "Verifique se o código do sorteio está correto."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {raffleName ? (
            status === "success" ? (
              <Alert variant="default" className="flex flex-col gap-2">
                <CheckCircle2 className="size-5 text-primary" />
                <AlertTitle>Cadastro realizado com sucesso!</AlertTitle>
                <AlertDescription>
                  Você já está participando deste sorteio. Agora é só aguardar o sorteio ser realizado.
                </AlertDescription>
              </Alert>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Seu nome</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite seu nome"
                    disabled={status === "loading" || disabled}
                    autoFocus
                    aria-invalid={status === "error"}
                  />
                </div>
                {status === "error" ? (
                  <Alert variant="destructive">
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{errorMsg}</AlertDescription>
                  </Alert>
                ) : null}
                <Button
                  type="submit"
                  disabled={
                    status === "loading" || disabled || !name.trim()
                  }
                  className="w-full bg-linear-to-r from-orange-400 to-amber-400 text-white shadow-[0_4px_14px_rgba(251,146,60,0.4)] hover:from-orange-500 hover:to-amber-500"
                >
                  {status === "loading" ? "Cadastrando..." : "Participar"}
                </Button>
              </form>
            )
          ) : (
            <Alert variant="destructive">
              <AlertTitle>Sorteio não encontrado</AlertTitle>
              <AlertDescription>
                Confirme com o organizador se o código{" "}
                <span className="font-mono">{slug}</span> está correto.
              </AlertDescription>
            </Alert>
          )}

          <p className="text-center text-xs text-orange-500/70">
            <Button variant="link" size="sm" asChild>
              <Link href="/">Voltar para início</Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

