import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Droplets, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import logo from "@/assets/logo-doers.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY on the recovery link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setValidSession(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setValidSession(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Senha curta", description: "Mínimo de 6 caracteres.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Senhas diferentes", description: "Confirme a mesma senha.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Senha redefinida! ✅", description: "Você já pode entrar com a nova senha." });
      await supabase.auth.signOut();
      navigate("/login", { replace: true });
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-primary text-primary-foreground px-page pt-12 pb-12 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="relative z-10 flex flex-col items-center">
          <img src={logo} alt="Doe+ RS" width={64} height={64} className="drop-shadow-xl mb-3" />
          <h1 className="text-2xl font-extrabold tracking-tight">Nova senha</h1>
          <p className="text-sm opacity-80 mt-1 text-center">Crie uma senha segura para sua conta.</p>
        </div>
      </div>

      <div className="flex-1 px-page pt-8 pb-12 container-mobile-lg w-full">
        {validSession === false ? (
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Link inválido ou expirado. Solicite um novo e-mail de recuperação.
            </p>
            <Button onClick={() => navigate("/forgot-password")} className="rounded-xl h-12 px-6">
              Pedir novo link
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-foreground text-sm">Nova senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoFocus
                  className="rounded-xl h-12 bg-card pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground p-1"
                  aria-label={show ? "Ocultar" : "Mostrar"}
                >
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm" className="text-foreground text-sm">Confirmar senha</Label>
              <Input
                id="confirm"
                type={show ? "text" : "password"}
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                className="rounded-xl h-12 bg-card"
              />
              {confirm && password === confirm && (
                <p className="text-xs text-[hsl(var(--success))] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Senhas conferem
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !password || !confirm}
              className="w-full h-12 rounded-xl text-base font-bold shadow-lg mt-2"
            >
              {loading ? <Droplets className="w-5 h-5 animate-pulse" /> : "Salvar nova senha"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
