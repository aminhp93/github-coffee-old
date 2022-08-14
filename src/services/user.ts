import request, { UserUrls } from 'request';

export const UserService = {
  getAuthUser(headers?: any) {
    return request(
      headers
        ? {
            headers,
            method: 'GET',
            url: UserUrls.getAuthUser,
          }
        : {
            method: 'GET',
            url: UserUrls.getAuthUser,
          }
    );
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
