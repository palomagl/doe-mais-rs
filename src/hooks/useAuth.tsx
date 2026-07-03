import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

// Module-level cache so every component using useAuth shares the same
// hydrated session and we don't flash the loading screen on every route
// change or component mount.
let cachedUser: User | null = null;
let hydrated = false;
const listeners = new Set<(u: User | null) => void>();

const setGlobal = (u: User | null) => {
  cachedUser = u;
  hydrated = true;
  listeners.forEach((cb) => cb(u));
};

// Start hydration once at module load
supabase.auth.getSession().then(({ data: { session } }) => {
  setGlobal(session?.user ?? null);
});
supabase.auth.onAuthStateChange((_event, session) => {
  setGlobal(session?.user ?? null);
});

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(cachedUser);
  const [loading, setLoading] = useState(!hydrated);

  useEffect(() => {
    const cb = (u: User | null) => {
      setUser(u);
      setLoading(false);
    };
    listeners.add(cb);
    // Sync immediately in case hydration completed before mount
    if (hydrated) {
      setUser(cachedUser);
      setLoading(false);
    }
    return () => {
      listeners.delete(cb);
    };
  }, []);

  return { user, loading };
};
