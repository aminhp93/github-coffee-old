import { Button, notification } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { getAuth, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { useEffect } from 'react';
import { UserService } from 'services/user';
import { selectUser, update } from './userSlice';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase

// console.log(app);
// Initialize Firebase Auth

// console.log('auth', auth);

export interface IUserProps {}

export default function User(props: IUserProps) {
  console.log(41);
  const auth = getAuth();
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
    console.log(83);
    (async (headers?: any) => {
      try {
        const res = await UserService.getAuthUser(headers);
        dispatch(update(res.data));
      } catch (e) {
        notification.error({ message: 'Get user failed' });
      }
    })();
  }, [dispatch]);

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
