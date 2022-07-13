import { Button } from 'antd';
import { urlBase64ToUint8Array } from 'utils';

export interface IWebPushProps {}

export default function WebPush(props: IWebPushProps) {
  const publicVapidKey =
    'BLzoqPQcEnYRTq2g1QEyu1XLHb3f1WzaxTnGjTWo3tZ3DI3AMx5Z46s01ReQrlPXzU-qVq5g7i_FX6UG6U-anuU';

  const triggerPushNotification = async () => {
    if ('serviceWorker' in navigator) {
      const register = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('waiting for acceptance');
      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
      console.log('acceptance complete');

      await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      console.error('Service workers are not supported in this browser');
    }
  };

  return (
    <div>
      <Button onClick={() => triggerPushNotification()}>Trigger noti</Button>
    </div>
  );
}
