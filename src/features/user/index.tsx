import { useAuth, AuthUserContext } from '@/context/SupabaseContext';
import { Button, Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function User() {
  const { authUser, signOut, signInWithOAuth }: AuthUserContext = useAuth();

  const items = [
    {
      key: '1',
      label: `${authUser?.email} - Logout`,
    },
  ];

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
        <Dropdown menu={{ items, onClick: signOut }} trigger={['hover']}>
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
