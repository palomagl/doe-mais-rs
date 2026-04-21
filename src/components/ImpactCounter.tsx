import { Heart } from "lucide-react";
import { LIVES_PER_DONATION } from "@/data/badges";

interface Props {
  donationCount: number;
}

const ImpactCounter = ({ donationCount }: Props) => {
  const lives = donationCount * LIVES_PER_DONATION;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-4 sm:p-5 shadow-lg relative overflow-hidden">
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
      <div className="absolute right-8 top-2 w-12 h-12 bg-white/5 rounded-full" />
      <div className="relative z-10 flex items-center gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
          <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs opacity-80 uppercase tracking-wide font-semibold">Seu impacto</p>
          <p className="text-2xl sm:text-3xl font-extrabold leading-none mt-1">
            {lives} <span className="text-sm sm:text-base font-semibold opacity-90">vidas</span>
          </p>
          <p className="text-[11px] sm:text-xs opacity-80 mt-1 leading-tight">
            {donationCount === 0
              ? "Comece hoje a salvar vidas! 🩸"
              : `${donationCount} doaç${donationCount === 1 ? "ão" : "ões"} • cada uma salva até 4 vidas`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImpactCounter;
