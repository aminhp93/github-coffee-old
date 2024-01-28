import { useEffect, useState } from 'react';
import supabase from '@/services/supabase';
import type { User } from '@supabase/supabase-js';

const useSupabaseAuth = () => {
  const [authUser, setAuthUser] = useState<User>();

  const signOut = async () => {
    await supabase.auth.signOut();
    setAuthUser(undefined);
  };

  const signInWithOAuth = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo:
          process.env.NODE_ENV === 'production'
            ? 'https://github-coffee-old.vercel.app/'
            : 'http://localhost:3333/',
      },
    });
  };

  // listen for Supabase state change
  useEffect(() => {
    // Listen for auth changes on:
    // SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED, USER_DELETED, PASSWORD_RECOVERY
    supabase.auth.getUser().then((res) => {
      if (res?.data?.user) {
        setAuthUser(res.data.user);
      }
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      if (session?.user) {
        setAuthUser(session.user);
      }
    });
    // Unsubscribe on cleanup
    return () => {
      data.subscription?.unsubscribe();
    };
  }, []);

  return {
    signInWithOAuth,
    signOut,
    authUser,
  };
};

export default useSupabaseAuth;
