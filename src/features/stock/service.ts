/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import dayjs from 'dayjs';
import { DATE_FORMAT, GET_FIELD_STOCK_SUPABASE } from './constants';
import { HistoricalQuote, HistoricalQuoteParams } from './Stock.types';
import supabase from '@/services/supabase';

const domain = 'https://restv2.fireant.vn';

const headers = {
  Authorization: `Bearer ${process.env.REACT_APP_AUTHORIZATION_TOKEN}`,
};

const StockService = {
  async getHistoricalQuotes(
    {
      symbol,
      startDate,
      endDate,
      offset = 0,
      limit = 20,
      returnRequest = false,
    }: HistoricalQuoteParams,
    callback?: (data: HistoricalQuote[], extraData: any) => void,
    extraDataCb?: any
  ) {
    if (!symbol) return;
    try {
      if (!endDate) endDate = dayjs().format(DATE_FORMAT);
      if (!startDate) startDate = dayjs().add(-7, 'days').format(DATE_FORMAT);
      if (returnRequest) {
        return axios({
          url: `${domain}/symbols/${symbol.toUpperCase()}/historical-quotes`,
          method: 'GET',
          headers,
          params: {
            startDate,
            endDate,
            offset,
            limit,
          },
        });
      }

      const res = await axios({
        url: `${domain}/symbols/${symbol.toUpperCase()}/historical-quotes`,
        method: 'GET',
        headers,
        params: {
          startDate,
          endDate,
          offset,
          limit,
        },
      });
      if (res.data) {
        if (callback) return callback(res.data, extraDataCb);
        return res.data;
      }
    } catch (e) {
      console.log(e);
    }
  },
  async getStockDataFromFireant({
    startDate,
    endDate,
    listSymbols,
  }: {
    startDate: string;
    endDate: string;
    listSymbols: string[];
  }) {
    const listPromises: any = [];
    listSymbols.forEach((i: string) => {
      listPromises.push(
        StockService.getHistoricalQuotes({
          symbol: i,
          startDate,
          endDate,
          offset: 0,
          returnRequest: true,
        })
      );
    });
    return Promise.all(listPromises);
  },
  getFundamentalsDataFromFireant(listSymbols: string[]) {
    const listPromises: any = [];
    listSymbols.forEach((i: any) => {
      listPromises.push(
        new Promise(async (resolve, reject) => {
          const res = await axios({
            url: `${domain}/symbols/${i}/fundamental`,
            method: 'GET',
            headers,
          });
          resolve({ ...res.data, symbol: i });
        })
      );
    });
    return Promise.all(listPromises);
  },
  async getFundamentals({ symbol }: any, callback?: any, extraDataCb?: any) {
    if (!symbol) return null;
    try {
      const res = await axios({
        url: `${domain}/symbols/${symbol}/fundamental`,
        method: 'GET',
        headers,
      });
      if (res.data) {
        if (callback) return callback(res.data, extraDataCb);

        return res.data;
      }
    } catch (e) {
      console.log(e);
    }
  },
  getWatchlist() {
    return axios({
      method: 'GET',
      url: `${domain}/me/watchlists`,
      headers,
    });
  },
  getStockNews(symbol: string) {
    if (!symbol) return;
    return axios({
      method: 'GET',
      url: `${domain}/posts?symbol=${symbol}&type=1&offset=0&limit=20`,
      headers,
      data: symbol,
    });
  },
  getStockNewsDetail(id: number) {
    if (!id) return;
    return axios({
      method: 'GET',
      url: `${domain}/posts/${id}`,
      headers,
    });
  },
  updateWatchlist(watchlistObj: any, updateData: any) {
    return axios({
      method: 'PUT',
      url: `${domain}/me/watchlists/${watchlistObj.watchlistID}`,
      headers,
      data: updateData,
    });
  },
  async getFinancialIndicator(symbol: string) {
    if (!symbol) return;

    const res = await axios({
      method: 'GET',
      headers,
      url: `${domain}/symbols/${symbol}/financial-indicators`,
    });
    if (res.data) {
      const newData: any = {};
      res.data.map((i: any) => {
        newData[i.name] = i.value;
        return i;
      });
      return { ...newData, symbol, key: symbol };
    }
    return null;
  },
  getBackTestData: ({
    database = 'supabase',
    symbols,
  }: {
    database?: 'supabase' | 'heroku';
    symbols: string[];
  }) => {
    if (database === 'supabase') {
      return supabase
        .from('stock')
        .select(
          'date,symbol,priceClose,priceHigh,priceLow,priceOpen,dealVolume,totalVolume'
        )
        .in('symbol', symbols);
    }
  },
  getStockInfo: () => {
    return supabase.from('stock_info').select('*');
  },
  insertStockData: (data: any) => {
    return supabase.from('stock').insert(data);
  },
  getStockBase: (symbol: string) => {
    return supabase.from('stock_base').select('*').in('symbol', [symbol]);
  },
  getAllStockBase: () => {
    return supabase.from('stock_base').select('*');
  },
  insertStockBase: (data: any) => {
    return supabase.from('stock_base').insert(data);
  },
  updateStockBase: (updatedObj: any) => {
    return supabase
      .from('stock_base')
      .update(updatedObj)
      .eq('symbol', updatedObj.symbol);
  },
  updateLastUpdated: ({ column, value }: any) => {
    return supabase
      .from('stock_info')
      .update({ [column]: value })
      .eq('id', 1);
  },
  getStockDataFromSupabase: ({
    startDate,
    endDate,
    listSymbols,
  }: {
    startDate: string;
    endDate: string;
    listSymbols: string[];
  }) => {
    return supabase
      .from('stock')
      .select(
        GET_FIELD_STOCK_SUPABASE
        // '*'
      )
      .in('symbol', listSymbols)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
  },
  deleteAndInsertStockData: (date: string, data: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Delete all old data with selected date
        await supabase
          .from('stock')
          .delete()
          .eq('date', date)
          .in(
            'symbol',
            data.map((i: any) => i.symbol)
          );

        // Insert new data with selected date
        await supabase.from('stock').insert(data);
        resolve({ status: 'success', date });
      } catch (e) {
        console.log(e);
        reject({ status: 'error', date });
      }
    });
  },
  getStockPost: ({
    symbol,
    type,
    offset,
    limit,
  }: {
    symbol: string;
    type: number;
    offset: number;
    limit: number;
  }) => {
    return axios({
      url: `${domain}/posts`,
      method: 'GET',
      headers,
      params: {
        symbol,
        type,
        offset,
        limit,
      },
    });
  },
  getLastUpdatedStock: (symbol: string) => {
    return supabase
      .from('stock')
      .select(
        GET_FIELD_STOCK_SUPABASE
        // '*'
      )
      .in('symbol', [symbol])
      .order('date', { ascending: true })
      .limit(1);
  },
  getCountStock: (symbol: string) => {
    return supabase
      .from('stock')
      .select('* ', {
        count: 'exact',
        head: true,
      })
      .in('symbol', [symbol]);
  },
};

export default StockService;

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
    return axios({
      method: 'POST',
      url: AccountUrls.postAuthToken,
      data,
    });
  },
  fetchAccount(headers: any) {
    return axios({
      headers,
      method: 'GET',
      url: AccountUrls.fetchAccount,
    });
  },
  fetchAccountPortfolio(headers: any) {
    return axios({
      headers,
      method: 'GET',
      url: AccountUrls.fetchAccountPortfolio,
    });
  },
  fetchAccountAssets(headers: any) {
    return axios({
      headers,
      method: 'GET',
      url: AccountUrls.fetchAccountAssets,
    });
  },
  fetchAccountStocks(headers: any) {
    return axios({
      headers,
      method: 'GET',
      url: AccountUrls.fetchAccountStocks,
    });
  },
  fetchOrdersHistory(headers: any, fromDate: string, toDate: string) {
    return axios({
      headers,
      method: 'GET',
      url: AccountUrls.fetchOrdersHistory(fromDate, toDate),
    });
  },
  fetchCashStatement(headers: any, index: number) {
    return axios({
      headers,
      method: 'GET',
      url: AccountUrls.fetchCashStatement(index),
    });
  },
};
