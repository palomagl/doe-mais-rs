import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useGuest, useRequireAccount, setGuest } from "@/lib/guest";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, Save, LogOut, Shield, AlertTriangle, Award, Scale, ChevronRight,
  Pencil, LogIn, UserRound,
} from "lucide-react";
import { successHaptic, tapHaptic } from "@/lib/native";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import BottomNav from "@/components/BottomNav";
import DigitalCard from "@/components/DigitalCard";
import BadgeGrid from "@/components/BadgeGrid";
import ShareButton from "@/components/ShareButton";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const formatCpf = (v: string) =>
  v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";

const FIELD_LABELS: Record<string, string> = {
  name: "Nome completo",
  cpf: "CPF",
  birth_date: "Data de nascimento",
  sex: "Sexo",
  blood_type: "Tipo sanguíneo",
  city: "Cidade",
};

const Profile = () => {
  const { user } = useAuth();
  const guest = useGuest();
  const requireAccount = useRequireAccount();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [donationCount, setDonationCount] = useState(0);
  const [cardPhotoUrl, setCardPhotoUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    sex: "",
    blood_type: "",
    city: "",
    cpf: "",
    birth_date: "",
  });

  useEffect(() => {
    if (guest) { setLoading(false); return; }
    if (!user) return;
    (async () => {
      const [{ data: p }, { count }] = await Promise.all([
        supabase
          .from("profiles")
          .select("name, sex, blood_type, city, cpf, birth_date, card_photo_url")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase.from("donations").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      if (p) {
        setForm({
          name: p.name ?? "",
          sex: p.sex ?? "",
          blood_type: p.blood_type ?? "",
          city: p.city ?? "",
          cpf: p.cpf ?? "",
          birth_date: p.birth_date ?? "",
        });
        setCardPhotoUrl(p.card_photo_url ?? null);
      }
      setDonationCount(count ?? 0);
      setLoading(false);
    })();
  }, [user, guest]);

  const missing = useMemo(
    () => Object.keys(FIELD_LABELS).filter((k) => !form[k as keyof typeof form]?.trim()),
    [form]
  );
  const isComplete = missing.length === 0;

  const openEdit = () => {
    if (requireAccount("editar seu perfil")) return;
    tapHaptic();
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (requireAccount("salvar seus dados")) return;
    if (!user || !form.name.trim()) {
      tapHaptic();
      toast({ title: "Preencha seu nome", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        name: form.name.trim(),
        sex: form.sex,
        blood_type: form.blood_type,
        city: form.city.trim(),
        cpf: form.cpf.trim() || null,
        birth_date: form.birth_date || null,
      })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      successHaptic();
      setEditOpen(false);
      toast({ title: "Perfil atualizado! ✅" });
    }
  };

  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-nav animate-page-in">
      {/* Header + avatar de edição */}
      <div className="bg-primary text-primary-foreground px-page pt-10 pb-12 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="relative z-10 container-mobile-lg mx-auto flex items-center gap-4">
          <button
            onClick={openEdit}
            aria-label="Editar perfil"
            className="relative shrink-0 active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 rounded-full bg-white/20 ring-2 ring-white/40 backdrop-blur flex items-center justify-center text-xl font-extrabold">
              {guest ? <UserRound className="w-7 h-7" /> : initials(form.name)}
            </div>
            <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-card text-primary flex items-center justify-center shadow-md">
              <Pencil className="w-3.5 h-3.5" />
            </span>
            {!guest && !isComplete && (
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-warning text-[13px] font-extrabold text-black flex items-center justify-center ring-2 ring-primary animate-soft-pulse">
                !
              </span>
            )}
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-extrabold truncate">
              {guest ? "Visitante" : form.name || "Complete seu perfil"}
            </h1>
            <p className="text-xs opacity-80 truncate">
              {guest ? "Modo sem login" : user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="px-page -mt-6 relative z-10 container-mobile-lg flex flex-col gap-5">
        {guest ? (
          <div className="rounded-2xl bg-card border border-border p-5 flex flex-col gap-3 shadow-soft">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h3 className="font-bold text-foreground">Você está sem login</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Entre ou crie uma conta para salvar seus dados, registrar doações,
              ganhar pontos e emitir sua carteirinha digital.
            </p>
            <button
              onClick={() => { setGuest(false); navigate("/login"); }}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-3.5 font-semibold shadow-md active:scale-[0.98] ripple"
            >
              <LogIn className="w-5 h-5" /> Entrar / Criar conta
            </button>
          </div>
        ) : (
          <>
            {/* Alerta de perfil incompleto */}
            {!isComplete && (
              <button
                onClick={openEdit}
                className="rounded-2xl border border-warning/40 bg-warning/10 p-4 flex items-center gap-3 text-left active:scale-[0.98]"
              >
                <span className="w-9 h-9 rounded-full bg-warning/20 text-warning flex items-center justify-center font-extrabold shrink-0">
                  !
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">Faltam alguns dados</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {missing.map((k) => FIELD_LABELS[k]).join(" · ")}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
              </button>
            )}

            {/* Carteirinha Digital */}
            {user && (
              <DigitalCard
                userId={user.id}
                name={form.name}
                bloodType={form.blood_type}
                cpf={form.cpf}
                cardPhotoUrl={cardPhotoUrl}
                onPhotoChange={setCardPhotoUrl}
              />
            )}

            {form.name && (
              <div className="flex justify-end">
                <ShareButton
                  variant="compact"
                  label="Compartilhar conquista"
                  text={`Sou doador(a) de sangue ${form.blood_type || ""} cadastrado(a) no Doe+ RS — já ajudei a salvar vidas no RS! 🩸 Junte-se a mim:`}
                />
              </div>
            )}

            {/* Resumo dos dados */}
            <div className="rounded-2xl bg-card border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-foreground">Dados pessoais</h3>
                <button
                  onClick={openEdit}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary px-3 py-1.5 rounded-full bg-primary/10 active:scale-95"
                >
                  <Pencil className="w-3.5 h-3.5" /> Editar
                </button>
              </div>
              <dl className="divide-y divide-border">
                {Object.entries(FIELD_LABELS).map(([key, label]) => {
                  const value = form[key as keyof typeof form];
                  return (
                    <div key={key} className="flex items-center justify-between gap-3 py-2.5">
                      <dt className="text-xs text-muted-foreground">{label}</dt>
                      <dd className={`text-sm font-medium text-right truncate ${value ? "text-foreground" : "text-warning"}`}>
                        {value || "Faltando !"}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>

            {/* Conquistas */}
            <div className="rounded-2xl bg-card border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-foreground">Minhas conquistas</h3>
                </div>
                <span className="text-xs text-muted-foreground">{donationCount} doações</span>
              </div>
              <BadgeGrid donationCount={donationCount} />
            </div>
          </>
        )}

        {/* Benefícios */}
        <button
          onClick={() => navigate("/benefits")}
          className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3 active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-foreground">Benefícios legais do doador</p>
            <p className="text-xs text-muted-foreground">Veja seus direitos no RS</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="rounded-xl bg-muted/40 p-4 flex items-start gap-3">
          <Shield className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Seus dados são protegidos por criptografia e usados apenas no app.
          </p>
        </div>

        {!guest && (!showLogoutConfirm ? (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-destructive/30 text-destructive py-3.5 font-semibold transition-all hover:bg-destructive/5 active:scale-[0.98]"
          >
            <LogOut className="w-5 h-5" /> Sair da conta
          </button>
        ) : (
          <div className="rounded-2xl border border-destructive/30 p-4 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <p className="text-sm font-semibold text-foreground">Tem certeza que deseja sair?</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium active:scale-[0.97]"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium active:scale-[0.97] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sair"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Painel de edição */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl max-h-[92vh] overflow-y-auto px-page pb-8"
        >
          <SheetHeader className="text-left mb-4">
            <SheetTitle>Editar perfil</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4 container-mobile-lg">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Nome *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">CPF</label>
                <input
                  value={form.cpf}
                  onChange={(e) => setForm({ ...form, cpf: formatCpf(e.target.value) })}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Nascimento</label>
                <input
                  type="date"
                  value={form.birth_date}
                  onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Sexo</label>
              <div className="flex gap-2">
                {["Masculino", "Feminino", "Outro"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm({ ...form, sex: s })}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all active:scale-[0.97] ${
                      form.sex === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Tipo sanguíneo</label>
              <div className="grid grid-cols-4 gap-2">
                {bloodTypes.map((bt) => (
                  <button
                    key={bt}
                    type="button"
                    onClick={() => setForm({ ...form, blood_type: bt })}
                    className={`rounded-xl border py-2.5 text-sm font-bold transition-all active:scale-[0.97] ${
                      form.blood_type === bt ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"
                    }`}
                  >
                    {bt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Cidade</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-3.5 font-semibold shadow-md transition-all active:scale-[0.98] ripple"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Salvar</>}
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <BottomNav />
    </div>
  );
};

export default Profile;
