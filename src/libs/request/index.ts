// import axios from 'axios';
// import { getAuth } from 'firebase/auth';
// import config from 'libs/config';
// import qs from 'qs';

// const baseUrl = config.apiUrl;

// let headers = {
//   'Content-Type': 'application/json',
// };

// const client = axios.create({
//   headers,
//   paramsSerializer: (params) => {
//     return qs.stringify(params);
//   },
// });

// // Add authenitcation token to request header
// client.interceptors.request.use(
//   async (config) => {
//     // Try refreshing the session, without relying on the cache

//     return {
//       ...config,
//     };
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// client.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response && err.response.status === 401) {
//       throw err;
//     } else if (err.response && err.response.status === 500) {
//       // TODO: display error dialog
//     }
//     return Promise.reject(err);
//   }
// );

// const request = async (options: any) => {
//   const accessToken = localStorage.getItem('ACCESS_TOKEN');

//   const finalOptions = {
//     ...{
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     },
//     ...options,
//   };
//   const onSuccess = (res: any) => res;

//   const onError: any = async (err: any) => {
//     console.log(err);
//     if (!err.response || !err.response.data) {
//       throw err;
//     }
//     if (
//       err.response.data.detail &&
//       err.response.data.detail === 'Token expired'
//     ) {
//       // wait 1 second
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       const auth: any = getAuth();

//       if (!auth || !auth.currentUser) return;
//       console.log('auth', auth);
//       const accessToken = await auth.currentUser.getIdToken();
//       console.log('accessToken', accessToken);

//       localStorage.removeItem('ACCESS_TOKEN');
//       localStorage.setItem('ACCESS_TOKEN', accessToken);
//       const headers = {
//         Authorization: `Bearer ${accessToken}`,
//       };
//       return request({
//         ...options,
//         headers,
//       });
//     }
//     throw err;
//   };

//   return client(finalOptions).then(onSuccess).catch(onError);
// };

// export default request;

// ** Axios
import axios, { AxiosRequestConfig } from 'axios';
import { getAuth } from 'firebase/auth';
import config from 'libs/config';

import qs from 'qs';

const baseUrl = config.apiUrl;

function subscribeTokenRefresh(cb: any) {
  refreshSubscribers.push(cb);
}

function onRrefreshed(token: string) {
  refreshSubscribers.map((cb: any) => cb(token));
}

let isRefreshing = false;
const refreshSubscribers: any = [];

const axiosInstance = axios.create({
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: (params) => {
    return qs.stringify(params);
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    // Do something before request is sent
    const accessToken = localStorage.getItem('ACCESS_TOKEN');
    if (accessToken) {
      config.headers!['Authorization'] = 'Bearer ' + accessToken;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    console.log(error);

    if (
      error.response.status === 403 &&
      error.response.data.detail === 'Token expired'
    ) {
      const { config } = error;
      const originalRequest = config;
      if (!isRefreshing) {
        isRefreshing = true;

        const auth: any = getAuth();

        if (!auth || !auth.currentUser) return;
        const accessToken = await auth.currentUser.getIdToken();
        localStorage.setItem('ACCESS_TOKEN', accessToken);
        isRefreshing = false;
        onRrefreshed(accessToken);
      }
      const retryOrigReq = new Promise((resolve) => {
        subscribeTokenRefresh((token: any) => {
          // replace the expired token and retry
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: 'Bearer ' + token,
          };
          resolve(axios(originalRequest));
        });
      });

      return retryOrigReq;
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axiosInstance;

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
