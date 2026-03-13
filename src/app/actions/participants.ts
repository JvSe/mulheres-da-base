"use server";

import { prisma } from "@/lib/prisma";
import type { ParticipantItem } from "@/lib/participants-server";

export type { ParticipantItem };

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
  participants: ParticipantItem[];
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
