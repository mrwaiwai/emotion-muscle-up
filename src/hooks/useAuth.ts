import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface TeacherProfile {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  schoolId: string;
  schoolName: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUserAccess = async (userId: string) => {
      try {
        const [{ data: roleData, error: roleError }, { data: teacherData, error: teacherError }] = await Promise.all([
          supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .eq('role', 'admin')
            .maybeSingle(),
          supabase
            .from('teacher_profiles')
            .select('id, user_id, display_name, email, school_id, schools(id, name)')
            .eq('user_id', userId)
            .maybeSingle(),
        ]);

        if (roleError) throw roleError;
        if (teacherError) throw teacherError;

        if (isMounted) {
          setIsAdmin(!!roleData);
          setTeacherProfile(teacherData ? {
            id: teacherData.id,
            userId: teacherData.user_id,
            displayName: teacherData.display_name,
            email: teacherData.email,
            schoolId: teacherData.school_id,
            schoolName: teacherData.schools?.name || '',
          } : null);
        }
      } catch (error) {
        console.error('Error loading user access:', error);
        if (isMounted) {
          setIsAdmin(false);
          setTeacherProfile(null);
        }
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
          void loadUserAccess(session.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
        setTeacherProfile(null);
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
    teacherProfile,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
