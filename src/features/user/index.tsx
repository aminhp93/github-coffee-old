import { useAuth } from '@/context/SupabaseContext';
import { Button, Dropdown, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function User() {
  const { authUser, signOut, signInWithOAuth }: any = useAuth();

  const menu = (
    <Menu onClick={signOut}>
      <Menu.Item>{authUser?.email} - Logout</Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'end',
        height: '32px',
        alignItems: 'center',
      }}
    >
      {authUser?.email ? (
        <Dropdown overlay={menu} trigger={['hover']}>
          <div style={{ cursor: 'pointer' }}>
            <UserOutlined />
          </div>
        </Dropdown>
      ) : (
        <Button size="small" onClick={signInWithOAuth}>
          Login
        </Button>
      )}
    </div>
  );
}
