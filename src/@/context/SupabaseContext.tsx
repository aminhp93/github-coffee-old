// ** React Imports
import { createContext, ReactNode, useContext } from 'react';

// ** Hooks Imports
import useSupabaseAuth from '@/hooks/useSupabaseAuth';
import type { User } from '@supabase/supabase-js';

export type AuthUserContext = {
  signOut: () => void;
  signInWithOAuth: () => void;
  authUser?: User;
};

const authUserContext = createContext<AuthUserContext>({
  signOut: () => {},
  signInWithOAuth: () => {},
  authUser: undefined,
});

export const SupabaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useSupabaseAuth();

  return (
    <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>
  );
};

// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(authUserContext);
