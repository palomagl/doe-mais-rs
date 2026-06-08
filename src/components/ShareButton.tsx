import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  title?: string;
  text: string;
  url?: string;
  label?: string;
  className?: string;
  variant?: "primary" | "ghost" | "outline";
}

const ShareButton = ({
  title = "Doe+ RS",
  text,
  url,
  label = "Compartilhar",
  className = "",
  variant = "outline",
}: Props) => {
  const { toast } = useToast();
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const shareUrl = url ?? window.location.origin;
    const fullText = `${text}\n\n${shareUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
        setShared(true);
        setTimeout(() => setShared(false), 1800);
        return;
      }
      await navigator.clipboard.writeText(fullText);
      setShared(true);
      toast({ title: "Link copiado! 📋", description: "Cole onde quiser para convidar." });
      setTimeout(() => setShared(false), 1800);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      toast({ title: "Não foi possível compartilhar", variant: "destructive" });
    }
  };

  const base = "w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold transition-all active:scale-[0.98]";
  const styles = {
    primary: "bg-primary text-primary-foreground shadow-md hover:scale-[1.01]",
    outline: "border border-border bg-card text-foreground hover:bg-muted/60",
    ghost: "text-primary hover:bg-primary/5",
  }[variant];

  return (
    <button onClick={handleShare} className={`${base} ${styles} ${className}`}>
      {shared ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
      {shared ? "Compartilhado!" : label}
    </button>
  );
};

export default ShareButton;
