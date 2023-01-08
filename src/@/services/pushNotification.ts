import axios from 'axios';
import config from '@/config';

const baseUrl = config.apiUrl;

const PushNotificationUrls = {
  create: `${baseUrl}/api/pushnotifications/`,
};

interface PushNotificationRequest {
  title: string;
  body: string;
}

const PushNotificationService = {
  createPushNotification(data: PushNotificationRequest) {
    return axios({
      method: 'POST',
      url: PushNotificationUrls.create,
      data,
    });
  },
};

export default PushNotificationService;
