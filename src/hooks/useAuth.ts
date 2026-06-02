import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAdminRole = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) throw error;
        if (isMounted) setIsAdmin(!!data);
      } catch (error) {
        console.error('Error checking admin role:', error);
        if (isMounted) setIsAdmin(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const applySession = (session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        setLoading(true);
        window.setTimeout(() => {
          void checkAdminRole(session.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    };

    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        applySession(session);
      }
    );

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      applySession(session);
    }).catch((error) => {
      console.error('Error getting auth session:', error);
      if (isMounted) {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    session,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
