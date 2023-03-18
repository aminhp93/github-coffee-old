import { useEffect, useState } from 'react';

import type { User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bnimawsouehpkbipqqvl.supabase.co';
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuaW1hd3NvdWVocGtiaXBxcXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM0NDY4MzcsImV4cCI6MTk4OTAyMjgzN30.K_BGIC_TlWbHl07XX94EWxRI_2Om_NKu_PY5pGtG-hk`;
const supabase = createClient(supabaseUrl, supabaseKey);

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
            ? 'https://github-coffee.vercel.app/'
            : 'http://localhost:3000/',
      },
    });
  };

  // listen for Supabase state change
  useEffect(() => {
    // Listen for auth changes on:
    // SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED, USER_DELETED, PASSWORD_RECOVERY
    supabase.auth.getUser().then((res) => {
      if (res && res.data && res.data.user) {
        setAuthUser(res.data.user);
      }
    });
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(event, session);
      if (session && session.user) {
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
