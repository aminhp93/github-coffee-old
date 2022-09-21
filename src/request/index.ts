import axios from 'axios';
import config from 'config';
import { getAuth, getIdToken } from 'firebase/auth';
import qs from 'qs';

const baseUrl = config.apiUrl;

let headers = {
  'Content-Type': 'application/json',
};

const client = axios.create({
  headers,
  paramsSerializer: (params) => {
    return qs.stringify(params);
  },
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

const request = async (options: any) => {
  const accessToken = localStorage.getItem('ACCESS_TOKEN');

  const finalOptions = {
    ...{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ...options,
  };
  const onSuccess = (res: any) => res;
  const onError: any = async (err: any) => {
    console.log(err);
    if (!err.response || !err.response.data) return;
    if (
      err.response.data.detail &&
      err.response.data.detail === 'Token expired'
    ) {
      const auth: any = getAuth();
      const accessToken = await getIdToken(auth.currentUser);
      console.log(accessToken);

      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.setItem('ACCESS_TOKEN', accessToken);
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      return request({
        ...options,
        headers,
      });
    }
  };

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
  getPusherToken: `${baseUrl}/api/chats/pusher/auth/`,
};

export const UserUrls = {
  getAuthUser: `${baseUrl}/api/users/firebase/auth/`,
  checkAuthUser: `${baseUrl}/api/users/firebase/auth/`,
  getAccessToken: `${baseUrl}/api/token/`,
  getPublic: `${baseUrl}/api/users/public/`,
  getProtected: `${baseUrl}/api/users/protected/`,
};

export const GitHubUrls = {
  getUsersDetail: (userId: string) => `https://api.github.com/users/${userId}`,
  getReposList: (userId: string) =>
    `https://api.github.com/users/${userId}/repos`,
  getReposDetail: (userId: string, repoId: string) =>
    `https://api.github.com/repos/${userId}/${repoId}`,
  getReposDetailLanguages: (userId: string, repoId: string) =>
    `https://api.github.com/repos/${userId}/${repoId}/languages`,
};

export const CustomTradingViewUrls = {
  getAllLayoutsUrl:
    'https://chart-api.vndirect.com.vn/1.1/charts?client=vnds_trading_view&user=vnds-0001813109',
  getSaveLayoutChartUrl: (id: number) =>
    `https://chart-api.vndirect.com.vn/1.1/charts?client=vnds_trading_view&user=vnds-0001813109&chart=${id}`,
  getSearchInfoSymbol: (searchString: string) =>
    `https://dchart-api.vndirect.com.vn/dchart/search?limit=30&query=${searchString}&type=&exchange=`,
  getDataHistoryUrl: (
    symbol: string,
    resolution: string,
    fromDate: string,
    toDate: string
  ) =>
    // `https://dchart-api.vndirect.com.vn/dchart/history?symbol=${symbol}&resolution=${resolution}&from=${fromDate}&to=${toDate}`,
    `https://chart.wichart.vn/data/history?symbol=${symbol}&resolution=${resolution}&from=${fromDate}&to=${toDate}`,
  getSymbolDetail: (symbol: string) =>
    `https://dchart-api.vndirect.com.vn/dchart/symbols?symbol=${symbol}`,
};

export const RedirectUrls = {
  get: `${baseUrl}/api/redirects/`,
};
