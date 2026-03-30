import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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
        toast({
          title: "Conta criada!",
          description: "Verifique seu e-mail para confirmar o cadastro.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Algo deu errado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="flex flex-col items-center gap-4 mb-10">
        <img src={logo} alt="Doe+ RS" width={80} height={80} className="drop-shadow-lg" />
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Doe<span className="text-primary">+</span> RS
        </h1>
        <p className="text-muted-foreground text-center text-sm max-w-xs">
          {isSignUp ? "Crie sua conta para começar a salvar vidas" : "Entre para continuar salvando vidas"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="rounded-xl h-12"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl text-base font-bold shadow-lg"
        >
          {loading ? "Carregando..." : isSignUp ? "Criar conta" : "Entrar"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
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

      <p className="mt-12 text-xs text-muted-foreground text-center">
        Doe+ RS — Incentivando a doação de sangue no Rio Grande do Sul
      </p>
    </div>
  );
};

export default Login;
