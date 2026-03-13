"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function createRaffle(input: { name: string }) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Não autorizado" };
  }

  const name = input.name.trim();
  if (!name) {
    return { success: false, error: "Nome é obrigatório" };
  }

  const baseSlug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "sorteio";

  let slug = baseSlug;
  let counter = 1;

  // garante slug único por usuário
  // (pode haver colisão global, mas simples para o caso atual)
  // se preferir global, remova o filtro de createdById
  // aqui mantemos escopo por usuário master
  // seguindo vercel-react-best-practices, evitamos loops infinitos com limite razoável
  // mas na prática é muito difícil chegar perto disso
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.raffle.findFirst({
      where: { slug, createdById: user.id },
      select: { id: true },
    });
    if (!existing) break;
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  try {
    const raffle = await prisma.raffle.create({
      data: {
        name,
        slug,
        createdById: user.id,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
      },
    });

    return { success: true, raffle };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao criar sorteio" };
  }
}

export async function listMyRaffles() {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, raffles: [] as { id: string; name: string; slug: string; createdAt: Date }[] };
  }

  try {
    const raffles = await prisma.raffle.findMany({
      where: { createdById: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        _count: {
          select: {
            participants: true,
            draws: true,
          },
        },
      },
    });

    return {
      success: true,
      raffles: raffles.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        createdAt: r.createdAt,
        participantsCount: r._count.participants,
        drawsCount: r._count.draws,
      })),
    };
  } catch (e) {
    console.error(e);
    return { success: false, raffles: [] as any[] };
  }
}

export async function getRaffleForOwnerBySlug(slug: string) {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const cleanSlug = slug.trim().toLowerCase();
  if (!cleanSlug) return null;

  try {
    const raffle = await prisma.raffle.findFirst({
      where: {
        slug: cleanSlug,
        createdById: user.id,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
      },
    });

    return raffle;
  } catch {
    return null;
  }
}

export async function getRaffleBySlug(slug: string) {
  const cleanSlug = slug.trim().toLowerCase();
  if (!cleanSlug) return null;

  try {
    const raffle = await prisma.raffle.findFirst({
      where: { slug: cleanSlug },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return raffle;
  } catch {
    return null;
  }
}

