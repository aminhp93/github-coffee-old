import { useState, useEffect } from 'react';
import { notification as noti } from 'antd';
import { requestForToken, onMessageListener } from './firebase';

const Notification = () => {
  const [notification, setNotification] = useState({ title: '', body: '' });

  useEffect(() => {
    if (notification?.title) {
      noti.success();
    }
  }, [notification]);

  requestForToken();

  onMessageListener()
    .then((payload) => {
      console.log(payload, 18);
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });
    })
    .catch((err) => console.log('failed: ', err));

  return <div>hello</div>;
};

export default Notification;
