import { notification } from 'antd';
import { update } from 'features/user/userSlice';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch } from 'libs/app/hooks';
import { UserService } from 'libs/services/user';
import { useEffect } from 'react';

export function useAuth() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      try {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const res = await UserService.getAuthUser();
            dispatch(update(res.data));
          } else {
            dispatch(update(null));
          }
        });
      } catch (e) {
        notification.error({ message: 'Get user failed' });
      }
    })();
  }, [dispatch]);

  return null;
}
