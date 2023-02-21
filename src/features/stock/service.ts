import axios from 'axios';
import moment from 'moment';
import { DATE_FORMAT } from './constants';
import { HistoricalQuoteParams, HistoricalQuote } from './types';
import request from '@/services/request';
import config from '@/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bnimawsouehpkbipqqvl.supabase.co';
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuaW1hd3NvdWVocGtiaXBxcXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM0NDY4MzcsImV4cCI6MTk4OTAyMjgzN30.K_BGIC_TlWbHl07XX94EWxRI_2Om_NKu_PY5pGtG-hk`;
const supabase = createClient(supabaseUrl, supabaseKey);

const domain = 'https://restv2.fireant.vn';
const baseUrl = config.apiUrl;

const headers = {
  Authorization:
    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTEzNjIzMDMyLCJuYmYiOjE2MTM2MjMwMzIsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2MTM2MjMwMzIsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiZmIyZWJkNzAzNTBiMDBjMGJhMWE5ZDA5NGUwNDMxMjYiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.OhgGCRCsL8HVXSueC31wVLUhwWWPkOu-yKTZkt3jhdrK3MMA1yJroj0Y73odY9XSLZ3dA4hUTierF0LxcHgQ-pf3UXR5KYU8E7ieThAXnIPibWR8ESFtB0X3l8XYyWSYZNoqoUiV9NGgvG2yg0tQ7lvjM8UYbiI-3vUfWFsMX7XU3TQnhxW8jYS_bEXEz7Fvd_wQbjmnUhQZuIVJmyO0tFd7TGaVipqDbRdry3iJRDKETIAMNIQx9miHLHGvEqVD5BsadOP4l8M8zgVX_SEZJuYq6zWOtVhlq3uink7VvnbZ7tFahZ4Ty4z8ev5QbUU846OZPQyMlEnu_TpQNpI1hg',
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
      if (!endDate) endDate = moment().format(DATE_FORMAT);
      if (!startDate) startDate = moment().add(-7, 'days').format(DATE_FORMAT);
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
    listSymbols.forEach((i: any) => {
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
      url: `https://restv2.fireant.vn/symbols/${symbol}/financial-indicators`,
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

    return request({
      url: `${baseUrl}/api/stocks/`,
      method: 'GET',
      params: {
        symbols: symbols.join(','),
      },
    });
  },
  getListStockJobs: () => {
    return request({
      url: `${baseUrl}/api/stocks/list-stock-jobs/`,
      method: 'GET',
    });
  },
  startDailyImportStockJob: () => {
    return request({
      url: `${baseUrl}/api/stocks/start-daily-import-stock-job/`,
      method: 'POST',
    });
  },
  cancelDailyImportStockJob: () => {
    return request({
      url: `${baseUrl}/api/stocks/cancel-daily-import-stock-job/`,
      method: 'POST',
    });
  },
  forceDailyImportStockJob: (data: any) => {
    return request({
      url: `${baseUrl}/api/stocks/force-daily-import-stock-job/`,
      method: 'POST',
      data,
    });
  },
  getLastUpdated: () => {
    return supabase.from('stock_info').select('*');
  },
  insertStockData: (data: any) => {
    return supabase.from('stock').insert(data);
  },
  deleteStockData: ({ column, value }: any) => {
    return supabase.from('stock').delete().eq(column, value);
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
        'date,symbol,priceClose,priceHigh,priceLow,priceOpen,dealVolume,totalVolume,totalValue'
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
        await StockService.deleteStockData({
          column: 'date',
          value: date,
        });

        // Insert new data with selected date
        await StockService.insertStockData(data);
        resolve({ status: 'success', date });
      } catch (e) {
        console.log(e);
        reject({ status: 'error', date });
      }
    });
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
