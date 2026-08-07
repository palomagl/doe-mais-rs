import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Droplets, Eye, EyeOff, UserRound } from "lucide-react";
import { setGuest } from "@/lib/guest";
import logo from "@/assets/logo-doers.png";

const translateError = (msg: string) => {
  if (msg.includes("Invalid login")) return "E-mail ou senha incorretos.";
  if (msg.includes("Email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (msg.includes("already registered") || msg.includes("already been registered")) return "Este e-mail já está cadastrado. Tente entrar.";
  if (msg.includes("Password should be")) return "A senha deve ter no mínimo 6 caracteres.";
  if (msg.includes("rate limit") || msg.includes("too many")) return "Muitas tentativas. Aguarde um momento.";
  if (msg.includes("network") || msg.includes("fetch")) return "Sem conexão. Verifique sua internet.";
  return msg;
};

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        setGuest(false);
        toast({ title: "Conta criada! 🎉", description: "Bem-vindo ao Doe+ RS!" });
        navigate("/");
      } else {
        const { data: authData, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        setGuest(false);

        const userId = authData?.user?.id;
        if (userId) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id")
            .eq("user_id", userId)
            .maybeSingle();

          if (!profileError && profile) {
            navigate("/dashboard", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: translateError(error.message || "Algo deu errado."),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero top */}
      <div className="bg-primary text-primary-foreground px-page pt-12 sm:pt-16 pb-12 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute bottom-4 -left-8 w-24 h-24 bg-white/5 rounded-full" />
        <div className="relative z-10 flex flex-col items-center">
          <img src={logo} alt="Doe+ RS" width={72} height={72} className="drop-shadow-xl mb-4" />
          <h1 className="text-3xl font-extrabold tracking-tight">
            Doe<span className="opacity-80">+</span> RS
          </h1>
          <p className="text-sm opacity-80 mt-1 text-center">
            Cada gota conta. Salve vidas no RS.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-page pt-8 pb-12 flex flex-col container-mobile-lg w-full">
        <h2 className="text-xl font-bold text-foreground mb-1">
          {isSignUp ? "Crie sua conta" : "Bem-vindo de volta"}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {isSignUp ? "Comece a salvar vidas hoje" : "Entre para continuar"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-foreground text-sm">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="rounded-xl h-12 bg-card"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-foreground text-sm">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="rounded-xl h-12 bg-card pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {isSignUp ? (
              <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
            ) : (
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary font-semibold hover:underline mt-0.5"
                >
                  Esqueci minha senha
                </Link>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="w-full h-12 rounded-xl text-base font-bold shadow-lg mt-2"
          >
            {loading ? (
              <Droplets className="w-5 h-5 animate-pulse" />
            ) : isSignUp ? "Criar conta" : "Entrar"}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-2">
            {isSignUp ? "Já tem uma conta?" : "Não tem conta?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-semibold hover:underline"
            >
              {isSignUp ? "Entrar" : "Criar conta"}
            </button>
          </p>

          <div className="flex items-center gap-3 mt-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] text-muted-foreground uppercase tracking-wide">ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={() => {
              setGuest(true);
              navigate("/dashboard", { replace: true });
            }}
            className="w-full h-12 rounded-xl border border-border bg-card text-foreground font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ripple"
          >
            <UserRound className="w-5 h-5 text-muted-foreground" />
            Continuar sem login
          </button>
          <p className="text-center text-[11px] text-muted-foreground -mt-1">
            No modo visitante você explora o app, mas não pode salvar dados pessoais.
          </p>
        </form>


        <p className="mt-auto pt-6 text-[11px] text-muted-foreground text-center">
          Doe+ RS — Incentivando a doação de sangue no Rio Grande do Sul 🩸
        </p>
      </div>
    </div>
  );
};

export default Login;
