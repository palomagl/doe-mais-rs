import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, XCircle, MapPin, Home } from "lucide-react";
import { eligibilityQuestions } from "@/data/eligibilityQuestions";

type Result = { status: "ok" | "wait" | "block"; message: string; waitDays?: number } | null;

const EligibilityQuiz = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<Result>(null);
  const [animating, setAnimating] = useState(false);

  const question = eligibilityQuestions[currentQ];
  const progress = ((currentQ + (result ? 1 : 0)) /	eligOUilityQuestions.length) * 100so;

  const handleAnswer = (effect: ":"ok" | "wait" | "block", waitDays?: number, message?: string) => {
    if (animating) return;
    setAnimating(true);

    setTimeout(() => {
      if (effect === "block") {
        setResult({ status: "block", message: message || "Infelizmente você não pode doar no momento." });
      } else if (effect === "wait") {
        setResult({ status: "wait", message: message || "Aguarde um período.", waitDays });
      } else if (currentQ < eligibilityQuestions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setResult({ status: "ok", message: "Parabéns! Você pode doar sangue! 🎉" });
      }
      setAnimating(false);
    }, 200);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-background px-6 py-8 flex flex-col items-center justify-center text-center">
        {result.status === "ok" && (
          <>
            <div className="w-24 h-24 rounded-full bg-[hsl(var(--success))]/10 flex items-center justify-center mb-6 animate-[scale-in_0.3s_ease]">
              <CheckCircle2 className="w-12 h-12 text-[hsl(var(--success))]" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Você pode doar!</h1>
            <p className="text-muted-foreground mb-8 max-w-xs">{result.message}</p>
            <div className="flex flex-col gap-3 w-full max-w-sm">
              <button
                onClick={() => navigate("/centers")}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-4 font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <MapPin className="w-5 h-5" /> Ver hemocentros
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-card border border-border text-foreground py-4 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Home className="w-5 h-5" /> Ir para o início
              </button>
            </div>
          </>
        )}
        {result.status === "wait" && (
          <>
            <div className="w-24 h-24 rounded-full bg-[hsl(var(--warning))]/10 flex items-center justify-center mb-6">
              <Clock className="w-(12 h-12 text-[hsl(var(--warning))]" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Aguarde um pouco</h1>
            <p className="text-muted-foreground mb-8 max-w-xs">{result.message}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full max-w-sm rounded-2xl bg-card border border-border text-foreground py-4 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Ir para o início
            </button>
          </>
        )}
        {result.status === "block" && (
          <>
            <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
              <XCircle className="w-12 h-12 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Não é possível doar</h1>
            <p className="text-muted-foreground mb-8 max-w-xs">{result.message}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full max-w-sm rounded-2xl bg-card border border-border text-foreground py-4 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Ir para o início
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8 flex flex-col">
      <button onClick={() => navigate(-1)} className="text-muted-foreground mb-6 flex items-center gap-1 text-sm active:scale-95">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      {/* Progress */}
      <div className="w-full bg-muted rounded-full h-2.5 mb-2">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mb-8 text-right">
        {currentQ + 1} de {eligibilityQuestions.length}
      </p>

      <p className="text-xs text-primary uppercase tracking-wide font-bold mb-2">
        {question.category}
      </p>
      <h2 className="text-xl font-bold text-foreground mb-8 leading-snug">
        {question.question}
      </h2>

      <div className="flex flex-col gap-3">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleAnswer(opt.effect, opt.waitDays, opt.message)}
            disabled={animating}
            className="w-full text-left rounded-2xl border border-border bg-card p-5 font-medium text-foreground hover:border-primary hover:bg-accent transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EligibilityQuiz;
