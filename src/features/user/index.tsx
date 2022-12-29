import { Button, Dropdown, Menu, notification } from 'antd';
import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { useAppDispatch, useAppSelector } from 'libs/app/hooks';
import config from 'libs/config';
import { UserService } from 'libs/services/user';
import { useEffect } from 'react';
import { selectUser, update } from './userSlice';

export default function User() {
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

      const res2 = await UserService.getAuthUser();
      dispatch(update(res2.data));
      notification.success({ message: 'Login success' });
    } catch (e) {
      notification.error({ message: 'Login failed' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    signOut(auth);
    dispatch(update({}));
    notification.success({ message: 'Logout success' });
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await UserService.getAuthUser();
        dispatch(update(res.data));
      } catch (e) {
        notification.error({ message: 'Get user failed' });
      }
    })();
  }, [dispatch]);

  const menu = (
    <Menu onClick={handleLogout}>
      <Menu.Item>Logout</Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'end',
        height: '32px',
        alignItems: 'center',
        marginRight: '8px',
      }}
    >
      <div style={{ marginRight: '8px' }}>
        {config.env === 'production' ? '[PRO] ' : '[DEV] '}
      </div>
      {user && user.id ? (
        <Dropdown overlay={menu} trigger={['click']}>
          <div style={{ cursor: 'pointer' }}>{`${user.username}`}</div>
        </Dropdown>
      ) : (
        <Button size="small" onClick={handleLogin}>
          Login
        </Button>
      )}
    </div>
  );
}
