import { useEffect, useState } from 'react';
import { Button, Input, notification } from 'antd';
import { UserService } from 'services/user';
import { IUser } from 'types';
import { initializeApp } from 'firebase/app';
import {
  GithubAuthProvider,
  signInWithPopup,
  getAuth,
  onAuthStateChanged,
  getIdToken,
} from 'firebase/auth';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { selectUser, update } from './userSlice';

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
// console.log(app);
// Initialize Firebase Auth
const auth = getAuth();
// console.log('auth', auth);

export interface IUserProps {}

export default function User(props: IUserProps) {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const provider = new GithubAuthProvider();

  const handleLogin = async () => {
    try {
      const res: any = await signInWithPopup(auth, provider);
      if (!res) {
        throw new Error('Could not complete signup');
      }

      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.setItem('ACCESS_TOKEN', res.user.accessToken);
      const headers = {
        Authorization: `Bearer ${res.user.accessToken}`,
      };
      await getAuthUser(headers);
      notification.success({ message: 'Login success' });
    } catch (e) {
      notification.error({ message: 'Login failed' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    dispatch(update({}));
    notification.success({ message: 'Logout success' });
  };

  const getAuthUser = async (headers?: any) => {
    try {
      const res = await UserService.getAuthUser(headers);
      dispatch(update(res.data));
    } catch (e) {
      notification.error({ message: 'Get user failed' });
    }
  };

  useEffect(() => {
    getAuthUser();
    // firebase.auth().currentUser.getIdToken();
    // onAuthStateChanged(auth, async (res: any) => {
    //   const idToken = await res.getIdToken();
    //   console.log('onAuthStateChanged', res, idToken);
    // });
  }, []);

  return (
    <div>
      {user && user.id ? (
        <div className="amin-flex">
          <div>{`${user.id} ${user.username} ${user.email}`}</div>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <div className="amin-flex">
          <div>No user</div>
          <div>
            <Button onClick={handleLogin}>Login</Button>
          </div>
        </div>
      )}
    </div>
  );
}
