import axios, { AxiosRequestConfig } from 'axios';
import config from 'libs/config';
import { useAuth } from 'libs/context/FirebaseContext';

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
    const accessToken = localStorage.getItem('accessToken');
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
  function (error) {
    console.log(error);

    if (
      error.response.status === 403 &&
      error.response.data.detail === 'Token expired'
    ) {
      console.log('403 ret');
      const { config } = error;
      const originalRequest = config;
      if (!isRefreshing) {
        isRefreshing = true;

        const { authUser }: any = useAuth();

        if (authUser?.accessToken) {
          const accessToken = authUser?.accessToken;
          console.log('accessToken', accessToken);
          localStorage.setItem('accessToken', accessToken);
          isRefreshing = false;
          onRrefreshed(accessToken);
        }
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
