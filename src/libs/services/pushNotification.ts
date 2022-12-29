import axios from 'axios';

import config from 'libs/config';

const baseUrl = config.apiUrl;

export const PushNotificationUrls = {
  create: `${baseUrl}/api/pushnotifications/`,
};

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
