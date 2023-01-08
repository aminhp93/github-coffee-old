import { Button, Dropdown, Menu } from 'antd';
import config from '@/config';
import { useAuth } from '@/context/FirebaseContext';

export default function User() {
  const { authUser, signOut, signInWithPopup }: any = useAuth();

  const menu = (
    <Menu onClick={signOut}>
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
      {authUser?.email ? (
        <Dropdown overlay={menu} trigger={['click']}>
          <div style={{ cursor: 'pointer' }}>{`${authUser?.email}`}</div>
        </Dropdown>
      ) : (
        <Button size="small" onClick={signInWithPopup}>
          Login
        </Button>
      )}
    </div>
  );
}
