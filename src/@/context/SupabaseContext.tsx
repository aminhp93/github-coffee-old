// ** React Imports
import { createContext, ReactNode, useContext } from 'react';

// ** Hooks Imports
import useSupabaseAuth from '@/hooks/useSupabaseAuth';

const authUserContext: any = createContext({
  signOut: async () => Promise.resolve(),
  signInWithOAuth: async () => Promise.resolve(),
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
