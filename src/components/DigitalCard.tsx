import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo-doers.png";

interface Props {
  userId: string;
  name: string;
  bloodType: string;
  cpf: string | null;
  cardPhotoUrl: string | null;
  onPhotoChange: (url: string | null) => void;
}

const DigitalCard = ({ userId, name, bloodType, cpf, cardPhotoUrl, onPhotoChange }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;
    const loadSignedUrl = async () => {
      if (!cardPhotoUrl) {
        setSignedUrl(null);
        return;
      }

      try {
        const { data, error } = await supabase.storage.from("donor-cards").createSignedUrl(cardPhotoUrl, 3600);
        if (error) throw error;
        if (active) setSignedUrl(data?.signedUrl ?? null);
      } catch {
        if (active) setSignedUrl(null);
      }
    };

    loadSignedUrl();
    return () => { active = false; };
  }, [cardPhotoUrl]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Arquivo muito grande", description: "Máx. 5MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/card.${ext}`;

      if (cardPhotoUrl) {
        const { error: removeError } = await supabase.storage.from("donor-cards").remove([cardPhotoUrl]);
        if (removeError) throw removeError;
      }

      const { error } = await supabase.storage
        .from("donor-cards")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;

      const { error: updateError } = await supabase.from("profiles").update({ card_photo_url: path }).eq("user_id", userId);
      if (updateError) throw updateError;

      const { data: signed, error: signedError } = await supabase.storage.from("donor-cards").createSignedUrl(path, 3600);
      if (signedError) throw signedError;

      setSignedUrl(signed?.signedUrl ?? null);
      onPhotoChange(path);
      toast({ title: "Carteirinha enviada! ✅" });
    } catch {
      toast({ title: "Erro ao enviar", description: "Não foi possível enviar a foto. Tente novamente.", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (!cardPhotoUrl) return;
    setUploading(true);
    try {
      const { error: removeError } = await supabase.storage.from("donor-cards").remove([cardPhotoUrl]);
      if (removeError) throw removeError;

      const { error: updateError } = await supabase.from("profiles").update({ card_photo_url: null }).eq("user_id", userId);
      if (updateError) throw updateError;

      setSignedUrl(null);
      onPhotoChange(null);
      toast({ title: "Foto removida" });
    } catch {
      toast({ title: "Erro ao remover", description: "Não foi possível remover a foto.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-3xl overflow-hidden border-2 border-primary/20 shadow-xl bg-gradient-to-br from-primary via-primary to-red-700 text-primary-foreground">
      {/* Top */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Doe+ RS" width={28} height={28} className="rounded-lg bg-white p-1" />
          <span className="text-xs font-bold tracking-wider opacity-90">CARTEIRINHA DOE+ RS</span>
        </div>
        <span className="text-[10px] opacity-70">DOADOR ATIVO</span>
      </div>

      {/* Body */}
      <div className="px-5 pb-5">
        <div className="rounded-2xl bg-white/10 backdrop-blur p-4 mb-4">
          <p className="text-[10px] uppercase opacity-70 tracking-wider">Nome</p>
          <p className="font-bold text-base leading-tight truncate">{name || "—"}</p>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <p className="text-[10px] uppercase opacity-70 tracking-wider">Tipo</p>
              <p className="font-extrabold text-2xl leading-none">{bloodType || "?"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase opacity-70 tracking-wider">CPF</p>
              <p className="font-mono text-sm">{cpf || "—"}</p>
            </div>
          </div>
        </div>

        {/* Photo zone */}
        <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur">
          {signedUrl ? (
            <div className="relative">
              <img src={signedUrl} alt="Carteirinha física" className="w-full h-44 object-cover" />
              <button
                onClick={handleRemove}
                disabled={uploading}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center active:scale-95"
                aria-label="Remover foto"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full py-8 flex flex-col items-center gap-2 active:scale-[0.98] transition-transform"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Camera className="w-6 h-6" />
                  <span className="text-xs font-semibold">Adicionar foto da carteirinha</span>
                  <span className="text-[10px] opacity-70">JPG ou PNG · até 5MB</span>
                </>
              )}
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default DigitalCard;
