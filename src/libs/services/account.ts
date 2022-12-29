import request from 'libs/request';

const AccountUrls = {
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

export const AccountService = {
  postAuthToken(data: any) {
    return request({
      method: 'POST',
      url: AccountUrls.postAuthToken,
      data,
    });
  },
  fetchAccount(headers: any) {
    return request({
      headers,
      method: 'GET',
      url: AccountUrls.fetchAccount,
    });
  },
  fetchAccountPortfolio(headers: any) {
    return request({
      headers,
      method: 'GET',
      url: AccountUrls.fetchAccountPortfolio,
    });
  },
  fetchAccountAssets(headers: any) {
    return request({
      headers,
      method: 'GET',
      url: AccountUrls.fetchAccountAssets,
    });
  },
  fetchAccountStocks(headers: any) {
    return request({
      headers,
      method: 'GET',
      url: AccountUrls.fetchAccountStocks,
    });
  },
  fetchOrdersHistory(headers: any, fromDate: string, toDate: string) {
    return request({
      headers,
      method: 'GET',
      url: AccountUrls.fetchOrdersHistory(fromDate, toDate),
    });
  },
  fetchCashStatement(headers: any, index: number) {
    return request({
      headers,
      method: 'GET',
      url: AccountUrls.fetchCashStatement(index),
    });
  },
};
