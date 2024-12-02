import { useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuthStore } from '../../store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setSession } = useAuthStore();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession]);

  return <>{children}</>;
}
