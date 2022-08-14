import { useEffect, useState } from 'react';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { GithubAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { Button } from 'antd';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: any = {
  apiKey: 'AIzaSyD10PnOvnUmemjEhTLJuDKQ7-oUiMd2e38',
  authDomain: 'reactjs-with-redux.firebaseapp.com',
  projectId: 'reactjs-with-redux',
  storageBucket: 'reactjs-with-redux.appspot.com',
  messagingSenderId: '37847634387',
  appId: '1:37847634387:web:ef0e42e463e2a333c0df26',
  measurementId: 'G-JPBLGYGNZ1',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);
// Initialize Firebase Auth
const auth = getAuth();
console.log(auth);

const useLogin = () => {
  const [error, setError] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const provider = new GithubAuthProvider();

  const login = async () => {
    setError(false);
    setIsPending(true);

    try {
      console.log(signInWithPopup, auth, provider);
      const res: any = await signInWithPopup(auth, provider);
      if (!res) {
        throw new Error('Could not complete signup');
      }

      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.setItem('ACCESS_TOKEN', res.user.accessToken);
      console.log(res);

      const user = res.user;
      console.log(user);
      setIsPending(false);
    } catch (error) {
      console.log(error);
      //   setError(error.message);
      setIsPending(false);
    }
  };

  return { login, error, isPending };
};

export interface IFirebaseCustomProps {}

export default function () {
  const { login, isPending } = useLogin();

  return (
    <div>
      FirebaseCustom
      <Button className="btn" onClick={login}>
        {isPending ? 'Loading...' : 'Login With Github'}
      </Button>
    </div>
  );
}
