import request, { UserUrls } from 'request';

export const UserService = {
  getAuthUser(headers?: any) {
    return request({
      headers,
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
};
