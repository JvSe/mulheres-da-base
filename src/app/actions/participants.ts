"use server";

import { prisma } from "@/lib/prisma";
type ParticipantDto = { id: string; name: string };

export async function registerParticipant(name: string) {
  const trimmed = name.trim();
  if (!trimmed) {
    return { success: false, error: "Nome é obrigatório" };
  }
  try {
    await prisma.participant.create({
      data: { name: trimmed },
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao cadastrar. Tente novamente." };
  }
}

export async function getParticipants(): Promise<{
  success: boolean;
  participants: ParticipantDto[];
}> {
  try {
    const list = await prisma.participant.findMany({
      orderBy: { createdAt: "desc" },
    });
    return {
      success: true,
      participants: list.map((p) => ({ id: p.id, name: p.name })),
    };
  } catch (e) {
    console.error(e);
    return { success: false, participants: [] };
  }
}

export async function createDraw(
  participantIds: string[],
  winnerId: string
): Promise<{ success: boolean; error?: string }> {
  if (participantIds.length === 0) {
    return { success: false, error: "Nenhum participante" };
  }
  if (!participantIds.includes(winnerId)) {
    return { success: false, error: "Vencedor inválido" };
  }
  try {
    await prisma.draw.create({
      data: {
        winnerId,
        participants: {
          create: participantIds.map((participantId) => ({
            participantId,
          })),
        },
      },
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao salvar sorteio" };
  }
}

export async function registerParticipantForRaffle(raffleId: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed) {
    return { success: false, error: "Nome é obrigatório" };
  }
  if (!raffleId) {
    return { success: false, error: "Sorteio inválido" };
  }
  try {
    await prisma.participant.create({
      data: { name: trimmed, raffleId },
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao cadastrar. Tente novamente." };
  }
}

export async function getParticipantsForRaffle(raffleId: string): Promise<{
  success: boolean;
  participants: ParticipantDto[];
}> {
  if (!raffleId) {
    return { success: false, participants: [] };
  }
  try {
    const list = await prisma.participant.findMany({
      where: { raffleId },
      orderBy: { createdAt: "desc" },
    });
    return {
      success: true,
      participants: list.map((p) => ({ id: p.id, name: p.name })),
    };
  } catch (e) {
    console.error(e);
    return { success: false, participants: [] };
  }
}

export async function createDrawForRaffle(
  raffleId: string,
  participantIds: string[],
  winnerId: string
): Promise<{ success: boolean; error?: string }> {
  if (!raffleId) {
    return { success: false, error: "Sorteio inválido" };
  }
  if (participantIds.length === 0) {
    return { success: false, error: "Nenhum participante" };
  }
  if (!participantIds.includes(winnerId)) {
    return { success: false, error: "Vencedor inválido" };
  }
  try {
    await prisma.draw.create({
      data: {
        winnerId,
        raffleId,
        participants: {
          create: participantIds.map((participantId) => ({
            participantId,
          })),
        },
      },
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao salvar sorteio" };
  }
}

