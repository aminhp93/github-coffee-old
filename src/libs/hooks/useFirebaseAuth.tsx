import { useState, useEffect } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword as signInWithEmailAndPasswordFirebase,
  createUserWithEmailAndPassword as createUserWithEmailAndPasswordFirebase,
  signOut as signOutFirebase,
  onAuthStateChanged,
  GithubAuthProvider,
  signInWithPopup as signInWithPopupFirebase,
  getIdToken as getIdTokenFirebase,
} from 'firebase/auth';

interface UserType {
  email: string;
  uid: string | number | null;
  accessToken: string;
}

const formatAuthUser = (user: UserType) => {
  return {
    uid: user.uid,
    email: user.email,
    accessToken: user.accessToken,
  };
};

const useFirebaseAuth = () => {
  const auth = getAuth();
  const [authUser, setAuthUser] = useState<null | UserType>(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState: any) => {
    console.log('authState', authState);
    if (!authState) {
      setAuthUser(null);
      setLoading(false);
      // remove accessToken from localStorage
      localStorage.removeItem('accessToken');
    } else {
      setLoading(true);
      const formattedUser = formatAuthUser(authState);
      setAuthUser(formattedUser);
      const accessToken = formattedUser.accessToken;
      localStorage.setItem('accessToken', accessToken);
      setLoading(false);
    }
  };

  const resetUser = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const signInWithPopup = async () => {
    const provider = new GithubAuthProvider();
    signInWithPopupFirebase(auth, provider);
  };

  const signInWithEmailAndPassword = (email: string, password: string) =>
    signInWithEmailAndPasswordFirebase(auth, email, password);

  const createUserWithEmailAndPassword = (email: string, password: string) =>
    createUserWithEmailAndPasswordFirebase(auth, email, password);

  const signOut = () => signOutFirebase(auth).then(resetUser);

  const getIdToken = () => {
    // get currentuser from firebase
    const user = auth?.currentUser;
    if (user) return getIdTokenFirebase(user, true);
  };

  // listen for Firebase state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);

    return () => unsubscribe();
  }, [auth]);

  console.log(authUser);

  return {
    loading,
    signOut,
    authUser,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    getIdToken,
  };
};

export default useFirebaseAuth;
