import axios from 'axios';
import { PushNotificationUrls } from 'libs/request';

interface PushNotificationRequest {
  title: string;
  body: string;
}

export const PushNotificationService = {
  createPushNotification(data: PushNotificationRequest) {
    return axios({
      method: 'POST',
      url: PushNotificationUrls.create,
      data,
    });
  },
};
