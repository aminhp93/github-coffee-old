import request from '@/services/request';
import config from '@/config';

const baseUrl = config.apiUrl;

const UserUrls = {
  getAuthUser: `${baseUrl}/api/users/firebase/auth/`,
  checkAuthUser: `${baseUrl}/api/users/firebase/auth/`,
  getAccessToken: `${baseUrl}/api/token/`,
  getPublic: `${baseUrl}/api/users/public/`,
  getProtected: `${baseUrl}/api/users/protected/`,
};

const UserService = {
  getAuthUser() {
    return request({
      method: 'GET',
      url: UserUrls.getAuthUser,
    });
  },
  getAccessToken(data: any) {
    return request({
      method: 'POST',
      url: UserUrls.getAccessToken,
      data,
    });
  },
  getPublic() {
    return request({
      method: 'GET',
      url: UserUrls.getPublic,
    });
  },
  getProtected() {
    return request({
      method: 'GET',
      url: UserUrls.getProtected,
    });
  },
};

export default UserService;