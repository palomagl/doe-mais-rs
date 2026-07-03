import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  title?: string;
  text: string;
  url?: string;
  label?: string;
  className?: string;
  variant?: "primary" | "ghost" | "outline" | "compact" | "icon";
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

  // Icon-only compact button (e.g. header)
  if (variant === "icon") {
    return (
      <button
        onClick={handleShare}
        aria-label={label}
        className={`w-9 h-9 rounded-full flex items-center justify-center bg-white/15 backdrop-blur ring-1 ring-white/25 text-primary-foreground active:scale-95 transition-all ${className}`}
      >
        {shared ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
      </button>
    );
  }

  const base = "flex items-center justify-center gap-2 rounded-xl font-semibold transition-all active:scale-[0.98]";
  const styles = {
    primary: "w-full bg-primary text-primary-foreground shadow-md hover:scale-[1.01] py-3.5",
    outline: "w-full border border-border bg-card text-foreground hover:bg-muted/60 py-3.5",
    ghost: "w-full text-primary hover:bg-primary/5 py-3",
    compact: "px-3.5 py-2 text-xs border border-border bg-card text-foreground hover:bg-muted/60",
  }[variant];

  const iconSize = variant === "compact" ? "w-3.5 h-3.5" : "w-5 h-5";

  return (
    <button onClick={handleShare} className={`${base} ${styles} ${className}`}>
      {shared ? <Check className={iconSize} /> : <Share2 className={iconSize} />}
      {shared ? "Pronto!" : label}
    </button>
  );
};


export default ShareButton;
