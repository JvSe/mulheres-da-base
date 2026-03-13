"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toLowerCase();
    if (!trimmed) return;
    router.push(`/participar/${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="min-h-svh bg-[linear-gradient(160deg,#FFE4E6_0%,#FFF1E6_35%,#FEF3C7_70%,#D1FAE5_100%)] px-4 py-10 flex items-center justify-center">
      <Card className="w-full max-w-md rounded-[28px] bg-white/90 p-6 shadow-[0_8px_32px_rgba(251,146,60,0.15)] backdrop-blur-sm md:p-8">
        <CardHeader className="flex flex-col gap-2 text-center">
          <CardTitle className="text-3xl md:text-4xl">
            Sorteador de Nomes
          </CardTitle>
          <CardDescription className="text-base md:text-lg">
            Informe o código do sorteio para participar
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-8 flex flex-col gap-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              placeholder="Ex: primeiro-sorteio"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-11 rounded-2xl bg-white/80"
              autoCapitalize="none"
              autoCorrect="off"
            />
            <Button
              type="submit"
              size="lg"
              className="w-full bg-linear-to-r from-orange-400 to-amber-400 text-white shadow-[0_4px_14px_rgba(251,146,60,0.4)] hover:from-orange-500 hover:to-amber-500"
              disabled={!code.trim()}
            >
              Participar
            </Button>
          </form>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <Link href="/login">Área do organizador</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
