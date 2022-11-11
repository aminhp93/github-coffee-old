import request, { AccountUrls } from 'libs/request';

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
