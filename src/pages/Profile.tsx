import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sex: "",
    blood_type: "",
    city: "",
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("name, sex, blood_type, city")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setForm(data);
        setLoading(false);
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update(form)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } else {
      toast({ title: "Perfil atualizado! ✅" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-primary text-primary-foreground px-6 pt-10 pb-8 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">Meu perfil</h1>
          <p className="text-sm opacity-80 mt-1">{user?.email}</p>
        </div>
      </div>

      <div className="px-6 pt-6">
        <div className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Nome</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Sexo</label>
            <div className="flex gap-2">
              {["Masculino", "Feminino", "Outro"].map((s) => (
                <button
                  key={s}
                  onClick={() => setForm({ ...form, sex: s })}
                  className={`flex-1 rounded-xl border py-3 text-sm font-medium transition-all ${
                    form.sex === s
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Tipo sanguíneo</label>
            <div className="grid grid-cols-4 gap-2">
              {bloodTypes.map((bt) => (
                <button
                  key={bt}
                  onClick={() => setForm({ ...form, blood_type: bt })}
                  className={`rounded-xl border py-3 text-sm font-bold transition-all ${
                    form.blood_type === bt
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  {bt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Cidade</label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-4 font-semibold text-lg shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Salvar</>}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
