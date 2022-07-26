import axios from 'axios';
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
    // Try refreshing the session, without relying on the cache

    return {
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
  const accessToken = localStorage.getItem('ACCESS_TOKEN');
  const finalOptions = {
    ...{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ...options,
  };
  console.log(finalOptions, options);
  const onSuccess = (res: any) => res;
  const onError = (err: any) => {};

  return client(finalOptions).then(onSuccess).catch(onError);
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
  detailPost: (postSlug: string) => `${baseUrl}/api/posts/${postSlug}/`,
  updatePost: (postSlug: string) => `${baseUrl}/api/posts/${postSlug}/`,
  deletePost: (postSlug: string) => `${baseUrl}/api/posts/${postSlug}/`,
};

export const ChatUrls = {
  getChatList: `${baseUrl}/api/chats/`,
  createChat: `${baseUrl}/api/chats/`,
};

export const UserUrls = {
  getAuthUser: `${baseUrl}/api/me/`,
  getAccessToken: `${baseUrl}/api/token/`,
};
