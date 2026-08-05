import { useEffect, useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { tapHaptic } from "@/lib/native";

const KEY = "doe_guest_mode";

let guest = typeof localStorage !== "undefined" && localStorage.getItem(KEY) === "1";
const subs = new Set<(g: boolean) => void>();

export const isGuest = () => guest;

export const setGuest = (value: boolean) => {
  guest = value;
  try {
    if (value) localStorage.setItem(KEY, "1");
    else localStorage.removeItem(KEY);
  } catch {
    /* storage indisponível */
  }
  subs.forEach((cb) => cb(value));
};

/** Reactive guest-mode flag. */
export const useGuest = () => {
  const [value, setValue] = useState(guest);
  useEffect(() => {
    const cb = (g: boolean) => setValue(g);
    subs.add(cb);
    setValue(guest);
    return () => {
      subs.delete(cb);
    };
  }, []);
  return value;
};

/**
 * Returns a function that blocks an action while in guest mode,
 * showing an alert inviting the user to sign in.
 * Usage: `if (blockGuest()) return;`
 */
export const useRequireAccount = () => {
  return useCallback((action = "editar suas informações") => {
    if (!guest) return false;
    tapHaptic();
    toast({
      title: "Faça login para continuar",
      description: `Você está navegando como visitante. Crie uma conta ou entre para ${action}.`,
      variant: "destructive",
    });
    return true;
  }, []);
};
