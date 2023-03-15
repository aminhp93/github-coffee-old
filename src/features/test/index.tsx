import { Button } from 'antd';
import { useAuth } from '@/context/SupabaseContext';
import { sum } from './utils';

export default function Test() {
  const { signOut, signInWithOAuth, authUser }: any = useAuth();

  return (
    <div className="height-100 width-100" style={{ background: 'white' }}>
      <Button
        size="small"
        onClick={() => (authUser ? signOut() : signInWithOAuth())}
      >
        {authUser ? 'Sign Out' : 'Sign In'}
      </Button>
      {authUser && <div>{authUser.email}</div>}
      <div onClick={() => sum()}>sum</div>
    </div>
  );
}
