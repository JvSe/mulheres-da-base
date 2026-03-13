import SorteadorSorteio from "@/components/SorteadorSorteio";
import { getParticipantsCached } from "@/lib/participants-server";

export default async function SorteioPage() {
  const initialParticipants = await getParticipantsCached();
  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#FFE4E6_0%,#FFF1E6_35%,#FEF3C7_70%,#D1FAE5_100%)] px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-[28px] bg-white/90 p-6 shadow-[0_8px_32px_rgba(251,146,60,0.15)] backdrop-blur-sm md:p-8">
        <SorteadorSorteio initialParticipants={initialParticipants} />
      </div>
    </div>
  );
}
