import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Droplets } from "lucide-react";
import logo from "@/assets/logo-doers.png";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast({ title: "Conta criada!", description: "Bem-vindo ao Doe+ RS!" });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Algo deu errado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero top */}
      <div className="bg-primary text-primary-foreground px-6 pt-16 pb-12 rounded-b-[2.5rem] relative overflow-hidden">
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
      <div className="flex-1 px-6 pt-8 pb-12 flex flex-col">
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
              className="rounded-xl h-12 bg-card"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-foreground text-sm">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="rounded-xl h-12 bg-card"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
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
        </form>

        <p className="mt-auto pt-6 text-[11px] text-muted-foreground text-center">
          Doe+ RS — Incentivando a doação de sangue no Rio Grande do Sul 🩸
        </p>
      </div>
    </div>
  );
};

export default Login;
