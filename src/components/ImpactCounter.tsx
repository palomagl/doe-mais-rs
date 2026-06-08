import { Heart } from "lucide-react";
import { LIVES_PER_DONATION } from "@/data/badges";

interface Props {
  donationCount: number;
}

const ImpactCounter = ({ donationCount }: Props) => {
  const lives = donationCount * LIVES_PER_DONATION;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary via-primary to-red-700 text-primary-foreground p-4 shadow-soft-lg relative overflow-hidden">
      <div className="absolute -right-6 -bottom-8 w-28 h-28 bg-white/10 rounded-full blur-xl" />
      <div className="absolute right-10 top-1 w-14 h-14 bg-white/10 rounded-full blur-md" />
      <div className="relative z-10 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0 ring-1 ring-white/30">
          <Heart className="w-6 h-6 fill-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] opacity-85 uppercase tracking-[0.12em] font-semibold">Seu impacto</p>
          <p className="text-[28px] font-extrabold leading-none mt-1">
            {lives} <span className="text-sm font-semibold opacity-90">vidas</span>
          </p>
          <p className="text-[11px] opacity-85 mt-1.5 leading-tight">
            {donationCount === 0
              ? "Comece hoje a salvar vidas! 🩸"
              : `${donationCount} doaç${donationCount === 1 ? "ão" : "ões"} • até 4 vidas por doação`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImpactCounter;
