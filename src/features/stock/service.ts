import axios from 'axios';
import moment from 'moment';
import { DATE_FORMAT } from './constants';

type HistoricalQuoteParams = {
  symbol: string;
  startDate?: string;
  endDate?: string;
  offset?: number;
  limit?: number;
};

type FundamentalsParams = {
  symbol: string;
};

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
    }: HistoricalQuoteParams,
    callback?: any,
    extraDataCb?: any
  ) {
    if (!symbol) return;
    try {
      if (!endDate) endDate = moment().format(DATE_FORMAT);
      if (!startDate) startDate = moment().add(-7, 'days').format(DATE_FORMAT);

      const res = await axios({
        url: `https://restv2.fireant.vn/symbols/${symbol.toUpperCase()}/historical-quotes`,
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
    } catch (error) {
      console.log(error);
    }
  },
  async getFundamentals(
    { symbol }: FundamentalsParams,
    callback?: any,
    extraDataCb?: any
  ) {
    if (!symbol) return null;
    try {
      const res = await axios({
        url: `https://restv2.fireant.vn/symbols/${symbol}/fundamental`,
        method: 'GET',
        headers,
      });
      if (res.data) {
        if (callback) return callback(res.data, extraDataCb);

        return res.data;
      }
    } catch (error) {
      console.log(error);
    }
  },
  getWatchlist() {
    return axios({
      method: 'GET',
      url: 'https://restv2.fireant.vn/me/watchlists',
      headers,
    });
  },
  getStockNews(symbol: string) {
    if (!symbol) return;
    return axios({
      method: 'GET',
      url: `https://restv2.fireant.vn/posts?symbol=${symbol}&type=1&offset=0&limit=20`,
      headers,
      data: symbol,
    });
  },
  getStockNewsDetail(id: number) {
    if (!id) return;
    return axios({
      method: 'GET',
      url: `https://restv2.fireant.vn/posts/${id}`,
      headers,
    });
  },
  updateWatchlist(watchlistObj: any, updateData: any) {
    return axios({
      method: 'PUT',
      url: `https://restv2.fireant.vn/me/watchlists/${watchlistObj.watchlistID}`,
      headers,
      data: updateData,
    });
  },
};

export default StockService;
