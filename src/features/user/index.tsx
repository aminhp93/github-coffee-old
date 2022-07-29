import { useEffect, useState } from 'react';
import { Button, Input, notification } from 'antd';
import { UserService } from 'services/user';

export interface IUserProps {}

export default function User(props: IUserProps) {
  const [user, setUser] = useState({} as any);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const requestData = {
        username,
        password,
      };
      const res = await UserService.getAccessToken(requestData);
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.setItem('ACCESS_TOKEN', res.data.access);
      const headers = {
        Authorization: `Bearer ${res.data.access}`,
      };
      await getAuthUser(headers);
      notification.success({ message: 'Login success' });
    } catch (e) {
      notification.error({ message: 'Login failed' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    setUser({});
    notification.success({ message: 'Logout success' });
  };

  const getAuthUser = async (headers?: any) => {
    try {
      const res = await UserService.getAuthUser(headers);
      setUser(res.data);
    } catch (e) {
      notification.error({ message: 'Get user failed' });
    }
  };

  const handleChangeUsername = (e: any) => {
    setUsername(e.target.value);
  };

  const handleChangePassword = (e: any) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    getAuthUser();
  }, []);

  return (
    <div>
      {user && user.id ? (
        <div className="amin-flex">
          <div>{`${user.id} ${user.username}`}</div>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <div className="amin-flex">
          <div>No user</div>
          <div>
            <div>
              <Input placeholder="Username" onChange={handleChangeUsername} />
            </div>
            <div>
              <Input placeholder="Password" onChange={handleChangePassword} />
            </div>
            <Button onClick={handleLogin}>Login</Button>
          </div>
        </div>
      )}
    </div>
  );
}
