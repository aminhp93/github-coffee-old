import { createSlice } from '@reduxjs/toolkit';
import { RootState, AppThunk } from 'app/store';

import { AccountService } from 'services';

const accountSlice = createSlice({
  name: 'account',
  initialState: {},
  reducers: {},
});

export default accountSlice.reducer;

export const postAuthToken =
  ({ username, password }: any): AppThunk =>
  async () => {
    const data = {
      password,
      username,
    };
    const res = await AccountService.postAuthToken(data);
    return res;
  };

export const fetchAccount =
  (token: string): AppThunk =>
  async () => {
    const headers = {
      'X-Auth-Token': token,
    };
    const res = await AccountService.fetchAccount(headers);
    return res;
  };

export const fetchAccountPortfolio =
  (token: string): AppThunk =>
  async () => {
    const headers = {
      'X-Auth-Token': token,
    };
    const res = await AccountService.fetchAccountPortfolio(headers);
    return res;
  };

export const fetchAccountAssets =
  (token: string): AppThunk =>
  async () => {
    const headers = {
      'X-Auth-Token': token,
    };
    const res = await AccountService.fetchAccountAssets(headers);
    return res;
  };

export const fetchAccountStocks =
  (token: string): AppThunk =>
  async () => {
    const headers = {
      'X-Auth-Token': token,
    };
    const res = await AccountService.fetchAccountStocks(headers);
    return res;
  };

export const fetchOrdersHistory =
  (token: string, fromDate: string, toDate: string): AppThunk =>
  async () => {
    const headers = {
      'X-Auth-Token': token,
    };
    const res = await AccountService.fetchOrdersHistory(
      headers,
      fromDate,
      toDate
    );
    return res;
  };

export const fetchCashStatement =
  (token: string): AppThunk =>
  async () => {
    const headers = {
      'X-Auth-Token': token,
    };
    let res: any;
    let next = true;

    let index = 0;
    let result: any = [];
    while (next) {
      res = await AccountService.fetchCashStatement(headers, index);
      if (res && res.data) {
        index += 1;
        if (res.data.transactions && res.data.transactions.length < 50) {
          next = false;
        }
        result = [...result, ...res.data.transactions];
      }
    }

    return result;
  };
