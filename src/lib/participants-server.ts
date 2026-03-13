import { cache } from "react";
import { prisma } from "@/lib/prisma";

export type ParticipantItem = { id: string; name: string };

/**
 * Per-request deduplication (rule server-cache-react).
 * Use in RSC only. For client refetch use the getParticipants server action.
 */
export const getParticipantsCached = cache(async (): Promise<ParticipantItem[]> => {
  const list = await prisma.participant.findMany({
    orderBy: { createdAt: "desc" },
  });
  return list.map((p) => ({ id: p.id, name: p.name }));
});
