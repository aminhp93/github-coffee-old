import { useEffect, useState } from 'react';

import type { User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_KEY!
);

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
        redirectTo: process.env.REACT_APP_REDIRECT_URL,
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
