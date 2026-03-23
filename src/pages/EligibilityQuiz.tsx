import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, XCircle, MapPin } from "lucide-react";
import { eligibilityQuestions } from "@/data/eligibilityQuestions";

type Result = { status: "ok" | "wait" | "block"; message: string; waitDays?: number } | null;

const EligibilityQuiz = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<Result>(null);

  const question = eligibilityQuestions[currentQ];
  const progress = ((currentQ) / eligibilityQuestions.length) * 100;

  const handleAnswer = (effect: "ok" | "wait" | "block", waitDays?: number, message?: string) => {
    if (effect === "block") {
      setResult({ status: "block", message: message || "Infelizmente você não pode doar no momento." });
      return;
    }
    if (effect === "wait") {
      setResult({ status: "wait", message: message || "Aguarde um período.", waitDays });
      return;
    }
    if (currentQ < eligibilityQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setResult({ status: "ok", message: "Parabéns! Você pode doar sangue! 🎉" });
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-background px-6 py-8 flex flex-col items-center justify-center text-center">
        {result.status === "ok" && (
          <>
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Você pode doar!</h1>
            <p className="text-muted-foreground mb-8">{result.message}</p>
            <button
              onClick={() => navigate("/centers")}
              className="w-full max-w-sm flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-4 font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <MapPin className="w-5 h-5" /> Ver hemocentros próximos
            </button>
          </>
        )}
        {result.status === "wait" && (
          <>
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 text-warning" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Aguarde um pouco</h1>
            <p className="text-muted-foreground mb-8">{result.message}</p>
            <button
              onClick={() => navigate("/")}
              className="w-full max-w-sm rounded-2xl bg-card border border-border text-foreground py-4 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Voltar ao início
            </button>
          </>
        )}
        {result.status === "block" && (
          <>
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Não é possível doar</h1>
            <p className="text-muted-foreground mb-8">{result.message}</p>
            <button
              onClick={() => navigate("/")}
              className="w-full max-w-sm rounded-2xl bg-card border border-border text-foreground py-4 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Voltar ao início
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8 flex flex-col">
      <button onClick={() => navigate("/")} className="text-muted-foreground mb-6 flex items-center gap-1 text-sm">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="w-full bg-muted rounded-full h-2 mb-8">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
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
            className="w-full text-left rounded-2xl border border-border bg-card p-5 font-medium text-foreground hover:border-primary hover:bg-accent transition-all active:scale-[0.98]"
          >
            {opt.label}
          </button>
        ))}
      </div>

      <p className="mt-auto pt-8 text-xs text-muted-foreground text-center">
        Pergunta {currentQ + 1} de {eligibilityQuestions.length}
      </p>
    </div>
  );
};

export default EligibilityQuiz;
