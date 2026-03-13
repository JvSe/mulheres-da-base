"use client";

import { login } from "@/app/actions/auth";
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
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setStatus("loading");
    setErrorMsg("");
    const result = await login({ email: email.trim(), password });
    if (result.success) {
      // redireciona para dashboard do usuário master
      window.location.href = "/dashboard";
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Erro ao fazer login");
    }
  }

  return (
    <div className="min-h-svh bg-[linear-gradient(160deg,#FFE4E6_0%,#FFF1E6_35%,#FEF3C7_70%,#D1FAE5_100%)] px-4 py-10 flex items-center justify-center">
      <Card className="w-full max-w-md rounded-[28px] bg-white/90 p-6 shadow-[0_8px_32px_rgba(251,146,60,0.15)] backdrop-blur-sm md:p-8">
        <CardHeader className="flex flex-col gap-2 text-center">
          <CardTitle className="text-2xl md:text-3xl">Entrar</CardTitle>
          <CardDescription>
            Acesse para gerenciar participantes e sorteios
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6 flex flex-col gap-6">
          {status === "error" ? (
            <Alert variant="destructive">
              <AlertTitle>Erro ao entrar</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          ) : null}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                disabled={status === "loading"}
                aria-invalid={status === "error"}
                className="py-5"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                disabled={status === "loading"}
                className="py-5"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-linear-to-r from-orange-400 py-5 to-amber-400 text-white shadow-[0_4px_14px_rgba(251,146,60,0.4)] hover:from-orange-500 hover:to-amber-500 text-base"
              disabled={status === "loading" || !email.trim() || !password}
            >
              {status === "loading" ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              <Link href="/">Voltar para início</Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

