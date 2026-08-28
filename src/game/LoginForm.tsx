import { useState } from "react";
import { setPlayer } from "@/game/usePlayer";
import { playSound } from "@/game/sound";

const AVATARS = ["🦸", "🦸‍♀️", "🧑‍⚕️", "👩‍⚕️", "🧑‍🚀", "🐉"];

export function LoginForm() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]!);

  return (
    <form
      className="space-y-4 pb-6"
      onSubmit={(e) => {
        e.preventDefault();
        playSound("levelup");
        setPlayer({ loggedIn: true, name: name.trim() || "Herói RS", avatar });
      }}
    >
      <div>
        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Seu nome de herói
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex.: Ana Lovato"
          className="mt-1.5 h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm font-semibold outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Avatar</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                playSound("click");
                setAvatar(a);
              }}
              className={`grid h-12 w-12 place-items-center rounded-2xl border text-2xl transition-all ${
                avatar === a
                  ? "border-primary bg-primary-soft scale-105"
                  : "border-border bg-card"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="h-13 w-full rounded-2xl gradient-hero py-4 text-sm font-extrabold text-primary-foreground shadow-glow transition-transform active:scale-[0.98]"
      >
        ENTRAR NO DOE+ HERO
      </button>
      <p className="text-center text-[11px] text-muted-foreground">
        Seu progresso fica salvo neste dispositivo.
      </p>
    </form>
  );
}
