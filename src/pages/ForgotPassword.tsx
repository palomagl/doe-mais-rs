import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Droplets, MailCheck } from "lucide-react";
import logo from "@/assets/logo-doers.png";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message?.includes("rate") ? "Aguarde um momento e tente novamente." : "Não foi possível enviar o e-mail.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-primary text-primary-foreground px-page pt-12 pb-12 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <Link to="/login" className="relative z-10 inline-flex items-center gap-1 text-sm opacity-90 hover:opacity-100 mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <div className="relative z-10 flex flex-col items-center">
          <img src={logo} alt="Doe+ RS" width={64} height={64} className="drop-shadow-xl mb-3" />
          <h1 className="text-2xl font-extrabold tracking-tight">Recuperar senha</h1>
          <p className="text-sm opacity-80 mt-1 text-center">
            Enviaremos um link para redefinir sua senha.
          </p>
        </div>
      </div>

      <div className="flex-1 px-page pt-8 pb-12 container-mobile-lg w-full">
        {sent ? (
          <div className="flex flex-col items-center text-center gap-4 mt-6">
            <div className="w-16 h-16 rounded-full bg-[hsl(var(--success))]/10 flex items-center justify-center">
              <MailCheck className="w-8 h-8 text-[hsl(var(--success))]" />
            </div>
            <h2 className="text-xl font-bold text-foreground">E-mail enviado! ✉️</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Verifique sua caixa de entrada (e o spam) em <span className="font-semibold text-foreground">{email}</span> e clique no link para criar uma nova senha.
            </p>
            <Link to="/login" className="mt-4 text-primary font-semibold hover:underline">
              Voltar ao login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-foreground text-sm">E-mail cadastrado</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                className="rounded-xl h-12 bg-card"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full h-12 rounded-xl text-base font-bold shadow-lg mt-2"
            >
              {loading ? <Droplets className="w-5 h-5 animate-pulse" /> : "Enviar link de recuperação"}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-2">
              Lembrou a senha?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
