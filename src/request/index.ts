import axios from 'axios';
import { notification } from 'antd';
import config from 'config';

const baseUrl = config.apiUrl;

let headers = {
  'Content-Type': 'application/json',
};

const client = axios.create({
  headers,
});

// Add authenitcation token to request header
client.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('ACCESS_TOKEN');

    // Try refreshing the session, without relying on the cache

    return {
      ...{ Authorization: `Bearer ${accessToken}` },
      ...config,
    };
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      throw err;
    } else if (err.response && err.response.status === 500) {
      // TODO: display error dialog
    }
    return Promise.reject(err);
  }
);

const request = (options: any) => {
  const onSuccess = (res: any) => res;
  const onError = (err: any) => {
    // notification.error({
    //   message: 'Error',
    //   description: String(err),
    //   placement: 'bottomLeft',
    //   duration: 5,
    // });
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;

export const AccountUrls = {
  postAuthToken: 'https://auth-api.vndirect.com.vn/v3/auth',
  fetchAccount: 'https://trade-api.vndirect.com.vn/accounts/0001069456',
  fetchAccountPortfolio:
    'https://trade-api.vndirect.com.vn/accounts/v3/0001069456/portfolio',
  fetchAccountAssets:
    'https://trade-api.vndirect.com.vn/accounts/v2/0001069456/assets',
  fetchAccountStocks:
    'https://trade-api.vndirect.com.vn/accounts/v3/0001069456/stocks',
  fetchOrdersHistory: (fromDate: string, toDate: string) =>
    `https://trade-report-api.vndirect.com.vn/accounts/0001069456/orders_history/?fromDate=${fromDate}&toDate=${toDate}&pageSize=1000`,
  fetchCashStatement: (index: number) =>
    `https://trade-report-api.vndirect.com.vn/accounts/0001069456/cashStatement?fromDate=2017-01-01&index=${index}&offset=50&types=`,
};

export const NoteUrls = {
  createNote: 'https://testapi.io/api/aminhp93/resource/note',
  listNote: 'https://testapi.io/api/aminhp93/resource/note',
  detailNote: (noteId: number) =>
    `https://testapi.io/api/aminhp93/resource/note/${noteId}`,
  updateNote: (noteId: number) =>
    `https://testapi.io/api/aminhp93/resource/note/${noteId}`,
  deleteNote: (noteId: number) =>
    `https://testapi.io/api/aminhp93/resource/note/${noteId}`,
};

export const PostUrls = {
  createPost: `${baseUrl}/api/posts/create/`,
  listPost: `${baseUrl}/api/posts/`,
  detailPost: (postId: number) => `${baseUrl}/api/posts/${postId}`,
  updatePost: (postId: number) => `${baseUrl}/api/posts/${postId}`,
  deletePost: (postId: number) => `${baseUrl}/api/posts/${postId}`,
};

export const ChatUrls = {
  getChat: `${baseUrl}/api/chat`,
  createChat: `${baseUrl}/api/chat`,
};

export const UserUrls = {
  getAuthUser: `${baseUrl}/api/me/`,
  getAccessToken: `${baseUrl}/api/token/`,
};
