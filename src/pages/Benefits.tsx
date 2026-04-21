import { ArrowLeft, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DONOR_BENEFITS } from "@/data/benefits";
import BottomNav from "@/components/BottomNav";

const Benefits = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-nav">
      <div className="bg-primary text-primary-foreground px-page pt-10 pb-8 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <button
          onClick={() => navigate(-1)}
          className="relative z-10 flex items-center gap-1 text-sm opacity-90 mb-3 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">Benefícios do doador ⚖️</h1>
          <p className="text-sm opacity-80 mt-1">Conheça seus direitos legais no RS</p>
        </div>
      </div>

      <div className="px-page pt-5 container-mobile-lg flex flex-col gap-3">
        {DONOR_BENEFITS.map((b) => (
          <div key={b.id} className="rounded-2xl bg-card border border-border p-4 flex gap-3">
            <div className="text-3xl shrink-0">{b.icon}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-sm">{b.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{b.description}</p>
              {b.law && (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-semibold">
                  <Scale className="w-3 h-3" /> {b.law}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="rounded-2xl bg-muted/40 p-4 text-center mt-2">
          <p className="text-xs text-muted-foreground">
            Para usufruir dos benefícios, leve sua carteirinha de doador e documento com foto.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Benefits;
