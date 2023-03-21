import { Button } from 'antd';
import { useAuth } from '@/context/SupabaseContext';
import { sum } from './utils';
import { useEffect } from 'react';
import supabase from '@/services/supabase';

export default function Test() {
  console.log(process.env);
  const { signOut, signInWithOAuth, authUser }: any = useAuth();

  useEffect(() => {
    supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'post' },
        (payload) => {
          console.log('Change received!', payload);
        }
      )
      .subscribe();
  }, []);

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
