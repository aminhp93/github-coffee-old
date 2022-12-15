import moment from 'moment';
import axios from 'axios';
import request, { RedirectUrls } from 'libs/request';

export const UNIT_BILLION = 1_000_000_000;
export const NUMBER_UNIT_REDUCED = 1000;
export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FORMAT = 'HH:mm';
export const FULL_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const TIME_FRAME = '1';
export const DELAY_TIME = 1_000 * 60;
export const MIN_TOTAL_VOLUME = 100_000;
export const MIN_TOTAL_VALUE = UNIT_BILLION * 5;
export const MIN_MEDIUM_TOTOL_VALUE = UNIT_BILLION * 5;
export const MIN_CHANGE = -1000;
export const MAX_CHANGE = 1000;

export const FinancialIndicatorsKeys = [
  'P/E',
  'P/S',
  'P/B',
  'EPS',
  'Tỷ lệ lãi ròng (%)',
  'YOEA (%)',
  'NIM (%)',
  'COF (%)',
  'LAR (%)',
  'LDR (%)',
  'CLR (%)',
  'CTA (%)',
  'ELR (%)',
  'ROA (%)',
  'ROE (%)',
  'CIR (%)',
  'LLRL (%)',
  'LLRNPL (%)',
  'Tỷ lệ nợ xấu (%)',
  'PCL (%)',
];

export const LIST_VN30 = [
  'ACB',
  'BID',
  'BVH',
  'CTG',
  'FPT',
  'GAS',
  'GVR',
  'HDB',
  'HPG',
  'KDH',
  'MBB',
  'MSN',
  'MWG',
  'NVL',
  'PDR',
  'PLX',
  'POW',
  'SAB',
  'SSI',
  'STB',
  'TCB',
  'TPB',
  'VCB',
  'VHM',
  'VIB',
  'VIC',
  'VJC',
  'VNM',
  'VPB',
  'VRE',
];

export const checkMarketOpen = (): boolean => {
  const currentTime = moment();
  const hour = currentTime.format('H');
  const date = currentTime.format('ddd');
  if (
    parseInt(hour) > 8 &&
    parseInt(hour) < 15 &&
    date !== 'Sun' &&
    date !== 'Sat'
  ) {
    return true;
  }
  return false;
};

export const getStartAndEndTime = () => {
  const current = moment();
  let add = 0;
  if (current.format('ddd') === 'Sat') {
    add = -1;
  } else if (current.format('ddd') === 'Sun') {
    add = -2;
  }
  const start = moment().add(add, 'days');

  start.set({
    hour: 9,
    minute: 0,
  });

  const end = moment().add(add, 'days');
  end.set({
    hour: 15,
    minute: 0,
  });
  return { start, end };
};

// interface HistoricalQuote {
//   adjRatio: number;
//   buyCount: number;
//   buyForeignQuantity: number;
//   buyForeignValue: number;
//   buyQuantity: number;
//   currentForeignRoom: number;
//   date: string;
//   dealVolume: number;
//   // key: string;
//   priceAverage: number;
//   priceBasic: number;
//   priceClose: number;
//   priceHigh: number;
//   priceLow: number;
//   priceOpen: number;
//   propTradingNetDealValue: number;
//   propTradingNetPTValue: number;
//   propTradingNetValue: number;
//   putthroughValue: number;
//   putthroughVolume: number;
//   sellCount: number;
//   sellForeignQuantity: number;
//   sellForeignValue: number;
//   sellQuantity: number;
//   // symbol: string;
//   totalValue: number;
//   totalVolume: number;
// }

export const HistoricalQuoteKeys = [
  'buyCount',
  'buyForeignQuantity',
  'buyForeignValue',
  'buyQuantity',
  'currentForeignRoom',
  'date',
  'dealVolume',
  // 'key',
  'priceAverage',
  'priceBasic',
  'priceClose',
  'priceHigh',
  'priceLow',
  'priceOpen',

  'putthroughValue',
  'putthroughVolume',
  'sellCount',
  'sellForeignQuantity',
  'sellForeignValue',
  'sellQuantity',
  // 'symbol',
  'totalValue',
  'totalVolume',
];

// interface Fundamental {
//   avgVolume3m: number;
//   avgVolume10d: number;
//   beta: number;
//   companyType: number;
//   dividend: number;
//   dividendYield: number;
//   eps: number;
//   foreignOwnership: number;
//   freeShares: number;
//   high52Week: number;
//   insiderOwnership: number;
//   institutionOwnership: number;
//   low52Week: number;
//   marketCap: number;
//   netProfit_TTM: number;
//   pe: number;
//   priceChange1y: number;
//   sales_TTM: number;
//   sharesOutstanding: number;
//   // symbol: string;
// }

export const FundamentalKeys = [
  'avgVolume3m',
  'avgVolume10d',
  'beta',
  'companyType',
  'dividend',
  'dividendYield',
  'eps',
  'foreignOwnership',
  'freeShares',
  'high52Week',
  'insiderOwnership',
  'institutionOwnership',
  'low52Week',
  'marketCap',
  'netProfit_TTM',
  'pe',
  'priceChange1y',
  'sales_TTM',
  'sharesOutstanding',
  // 'symbol',
];

// interface FinancialIndicators {
//   'P/E': number;
//   'P/S': number;
//   'P/B': number;
//   EPS: number;
//   'Tỷ lệ lãi ròng (%)': number;
//   'YOEA (%)': number;
//   'NIM (%)': number;
//   'COF (%)': number;
//   'LAR (%)': number;
//   'LDR (%)': number;
//   'CLR (%)': number;
//   'CTA (%)': number;
//   'ELR (%)': number;
//   'ROA (%)': number;
//   'ROE (%)': number;
//   'CIR (%)': number;
//   'LLRL (%)': number;
//   'LLRNPL (%)': number;
//   'Tỷ lệ nợ xấu (%)': number;
//   'PCL (%)': number;
// }

export const NoDataKeys = [
  'adjRatio', // HistoricalQuote
  'propTradingNetDealValue', // HistoricalQuote
  'propTradingNetPTValue', // HistoricalQuote
  'propTradingNetValue', // HistoricalQuote
];

export const NoDataColumns = NoDataKeys.map((i) => {
  return {
    title: i,
    dataIndex: i,
    key: i,
    align: 'right',
    sorter: (a: any, b: any) => a[i] - b[i],
    render: (data: any) => {
      if (typeof data === 'number') {
        if (data > 1_000) {
          return Number(data.toFixed(0)).toLocaleString();
        }
        return Number(data.toFixed(1)).toLocaleString();
      }
      return data;
    },
  };
});

export const HistoricalQuoteColumns = HistoricalQuoteKeys.map((i) => {
  if (i === 'date') {
    return {
      title: 'dateeeeeeeee',
      dataIndex: i,
      key: i,
      render: (text: string) => moment(text).format(DATE_FORMAT),
    };
  }
  return {
    title: i,
    dataIndex: i,
    key: i,
    align: 'right',
    width: 200,
    sorter: (a: any, b: any) => a[i] - b[i],
    render: (data: any) => {
      if (typeof data === 'number') {
        if (data > 1_000) {
          return Number(data.toFixed(0)).toLocaleString();
        }
        return Number(data.toFixed(1)).toLocaleString();
      }
      return data;
    },
  };
});

export const FundamentalColumns = FundamentalKeys.map((i) => {
  return {
    title: i,
    dataIndex: i,
    key: i,
    sorter: (a: any, b: any) => a[i] - b[i],
    align: 'right',
    render: (data: any) => {
      if (typeof data === 'number') {
        if (data > 1_000) {
          return Number(data.toFixed(0)).toLocaleString();
        }
        return Number(data.toFixed(1)).toLocaleString();
      }
      return data;
    },
  };
});

export const FinancialIndicatorsColumns: any = FinancialIndicatorsKeys.map(
  (i) => {
    return {
      // remove all whitespace
      title: i.replace(/\s/g, ''),
      dataIndex: i,
      key: i,
      sorter: (a: any, b: any) => a[i] - b[i],
      align: 'right',
      render: (data: any) => {
        if (typeof data === 'number') {
          if (data > 1_000) {
            return Number(data.toFixed(0)).toLocaleString();
          }
          return Number(data.toFixed(1)).toLocaleString();
        }
        return data;
      },
    };
  }
);

export const getHistorialQuote = async (symbol: string) => {
  if (!symbol) return;
  const startDate = moment().add(-1000, 'days').format(DATE_FORMAT);
  const endDate = moment().add(0, 'days').format(DATE_FORMAT);

  const res = await axios({
    method: 'GET',
    headers: {
      Authorization:
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTEzNjIzMDMyLCJuYmYiOjE2MTM2MjMwMzIsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2MTM2MjMwMzIsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiZmIyZWJkNzAzNTBiMDBjMGJhMWE5ZDA5NGUwNDMxMjYiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.OhgGCRCsL8HVXSueC31wVLUhwWWPkOu-yKTZkt3jhdrK3MMA1yJroj0Y73odY9XSLZ3dA4hUTierF0LxcHgQ-pf3UXR5KYU8E7ieThAXnIPibWR8ESFtB0X3l8XYyWSYZNoqoUiV9NGgvG2yg0tQ7lvjM8UYbiI-3vUfWFsMX7XU3TQnhxW8jYS_bEXEz7Fvd_wQbjmnUhQZuIVJmyO0tFd7TGaVipqDbRdry3iJRDKETIAMNIQx9miHLHGvEqVD5BsadOP4l8M8zgVX_SEZJuYq6zWOtVhlq3uink7VvnbZ7tFahZ4Ty4z8ev5QbUU846OZPQyMlEnu_TpQNpI1hg',
    },
    url: `https://restv2.fireant.vn/symbols/${symbol}/historical-quotes?startDate=${startDate}&endDate=${endDate}&offset=0&limit=20`,
  });
  if (res.data) {
    const last_data = res.data[0];
    const last_2_data = res.data[1];
    const last_20_day_historical_quote = res.data;
    const totalValue_last20_min = Math.min(
      ...res.data.map((item: any) => item.totalValue)
    );
    const totalValue_last20_max = Math.max(
      ...res.data.map((item: any) => item.totalValue)
    );

    const averageVolume_last5 =
      res.data.slice(1, 6).reduce((a: any, b: any) => a + b.dealVolume, 0) / 5;

    const changeVolume_last5 =
      (res.data[0].dealVolume - averageVolume_last5) / averageVolume_last5;

    const averageVolume_last20 =
      res.data.slice(1, 21).reduce((a: any, b: any) => a + b.dealVolume, 0) /
      20;

    const changeVolume_last20 =
      (res.data[0].dealVolume - averageVolume_last20) / averageVolume_last20;

    const changePrice =
      (last_data.priceClose - last_2_data.priceClose) / last_2_data.priceClose;

    let count_5_day_within_base = {
      count: 0,
      valid: false,
    };
    // count the number of dasy which percent price is within the min and max from the base today

    // base --> calculate from last_2_day
    const base = last_2_data.priceClose;
    const min_base = base - base * 0.07; // 7% up from last_2_day
    const max_base = base + base * 0.07; // 7% up from last_2_day

    const last_5_data = res.data.slice(1, 6);

    last_5_data.forEach((item: any) => {
      if (item.priceClose >= min_base && item.priceClose <= max_base) {
        count_5_day_within_base.count += 1;
      }
      if (count_5_day_within_base.count === 5) {
        count_5_day_within_base.valid = true;
      }
    });

    const strong_sell: any = [];
    const strong_buy: any = [];

    const last_10_data = res.data.slice(1, 11);
    const averageVolume_last10 =
      last_10_data.reduce((a: any, b: any) => a + b.dealVolume, 0) / 10;

    last_10_data.forEach((i: any, index: number) => {
      if (index === 0) return;
      const last_price = last_10_data[index - 1].priceClose;
      let isSell = false;
      let isBuy = false;
      // Check if it is the sell or buy
      // Normal case is priceClose > priceOpen --> buy
      if (i.priceClose > last_price * 1.03) {
        isBuy = true;
      }
      if (i.priceClose < last_price * 0.97) {
        isSell = true;
      }

      let strong_volume = false;
      // Check if volume is strong
      if (i.dealVolume > averageVolume_last10) {
        strong_volume = true;
      }

      if (strong_volume && isBuy) {
        strong_buy.push(i);
      }
      if (strong_volume && isSell) {
        strong_sell.push(i);
      }
    });

    const last_10_day_summary: any = {
      strong_buy,
      strong_sell,
    };

    const test_in_day_review = 123;

    return {
      ...last_data,
      symbol,
      key: symbol,
      last_20_day_historical_quote,
      totalValue_last20_min,
      totalValue_last20_max,
      averageVolume_last5,
      changeVolume_last5,
      averageVolume_last20,
      changeVolume_last20,
      changePrice,
      count_5_day_within_base,
      last_10_day_summary,
      test_in_day_review,
    };
  }
  return null;
};

export const getFinancialIndicator = async (symbol: string) => {
  if (!symbol) return;

  const res = await axios({
    method: 'GET',
    headers: {
      Authorization:
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTEzNjIzMDMyLCJuYmYiOjE2MTM2MjMwMzIsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2MTM2MjMwMzIsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiZmIyZWJkNzAzNTBiMDBjMGJhMWE5ZDA5NGUwNDMxMjYiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.OhgGCRCsL8HVXSueC31wVLUhwWWPkOu-yKTZkt3jhdrK3MMA1yJroj0Y73odY9XSLZ3dA4hUTierF0LxcHgQ-pf3UXR5KYU8E7ieThAXnIPibWR8ESFtB0X3l8XYyWSYZNoqoUiV9NGgvG2yg0tQ7lvjM8UYbiI-3vUfWFsMX7XU3TQnhxW8jYS_bEXEz7Fvd_wQbjmnUhQZuIVJmyO0tFd7TGaVipqDbRdry3iJRDKETIAMNIQx9miHLHGvEqVD5BsadOP4l8M8zgVX_SEZJuYq6zWOtVhlq3uink7VvnbZ7tFahZ4Ty4z8ev5QbUU846OZPQyMlEnu_TpQNpI1hg',
    },
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
};

export const getFundamentals = async (symbol: string) => {
  if (!symbol) return;

  const res = await axios({
    method: 'GET',
    headers: {
      Authorization:
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTEzNjIzMDMyLCJuYmYiOjE2MTM2MjMwMzIsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2MTM2MjMwMzIsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiZmIyZWJkNzAzNTBiMDBjMGJhMWE5ZDA5NGUwNDMxMjYiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.OhgGCRCsL8HVXSueC31wVLUhwWWPkOu-yKTZkt3jhdrK3MMA1yJroj0Y73odY9XSLZ3dA4hUTierF0LxcHgQ-pf3UXR5KYU8E7ieThAXnIPibWR8ESFtB0X3l8XYyWSYZNoqoUiV9NGgvG2yg0tQ7lvjM8UYbiI-3vUfWFsMX7XU3TQnhxW8jYS_bEXEz7Fvd_wQbjmnUhQZuIVJmyO0tFd7TGaVipqDbRdry3iJRDKETIAMNIQx9miHLHGvEqVD5BsadOP4l8M8zgVX_SEZJuYq6zWOtVhlq3uink7VvnbZ7tFahZ4Ty4z8ev5QbUU846OZPQyMlEnu_TpQNpI1hg',
    },
    url: `https://restv2.fireant.vn/symbols/${symbol}/fundamental`,
  });
  if (res.data) {
    return { ...res.data, symbol, key: symbol };
  }
  return null;
};

export const getDailyTransaction = async (symbol: string) => {
  if (!symbol) return;

  const res = await request({
    url: RedirectUrls.get,
    method: 'GET',
    params: {
      url: 'https://finance.vietstock.vn/data/getstockdealdetail',
      method: 'POST',
      payload: `code=${symbol}&seq=0&__RequestVerificationToken=XdOhxweLi810dUPhpPF2zb0jwdxW8HlHFuKN9O8LlqFVSui70Sb78wOe54bhUP_dOsAdnrRQgnzsBkPfVOFVTQusVI18BAFw09rCZ3iG0CE1`,
      headers: JSON.stringify({
        Accept: '*/*',
        'Accept-Language': 'vi-VN,vi;q=0.9,fr;q=0.8,en-US;q=0.7,en;q=0.6',
        Connection: 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Cookie:
          'language=vi-VN; ASP.NET_SessionId=xta2iw1vhl0qbrbyamrpqvtv; __RequestVerificationToken=t0aDnrKvz5kX5GA5v0V2mYDzJirplLNceZOteJcZXmbaXqnMDiy4etBeH9YMLp104c6QyvyT56sKFmHBggDYgH_XIMNiZhAL2-7y8Bw8wwA1; Theme=Light; _ga=GA1.2.1021059025.1671084404; _gid=GA1.2.1200488645.1671084404; AnonymousNotification=; isShowLogin=true; __gpi=UID=00000b90f5824195:T=1671084404:RT=1671084404:S=ALNI_MaWkdNZ3pH1FQ7Cmk42tkowDVsE2w; cto_bundle=Nr67d18lMkJxaDYwUndaamFDJTJCJTJGV2QyWmpRQzZSMUJRZ0YzRm5OYjM1VGxZcGRBTVB0UmZGOSUyRldEN2hvQ0NacjFyTEIza3RvZGpxS0dBTUhac2JHSVlUTkZNUUZYQ2IxQ08wTSUyQjI5ejZENlBFQzVSY2pLdWgyV3RMcUdkJTJGJTJGcXJaS3FNRUh0SVJjeGpPaGpKayUyQjk4SHolMkJqdUlrelhXckE0OUgwanQzZE9KbllTc3dWcGxDUkRBSExxM0VzSEluYXNLM0dwRHE1V0E3RzQ1JTJCNHVDb0VMJTJCTlE5TEZBdyUzRCUzRA; _cc_id=b87127fb46a8e636479e6e4c2e5c6d; panoramaId_expiry=1671689207685; panoramaId=6b3d63f0724174ef8c9491d014404945a702ca10edc47a292d273af4be34fcab; dable_uid=77199305.1659932618305; __gads=ID=d90ce89761abbb3b-22d2357cebd800af:T=1671084404:S=ALNI_MZIydSYhANWpzuE4F7FcTGttsC0pg; finance_viewedstock=VND,VPB,; _dd_s=logs=1&id=86039806-fe62-449b-953c-ea6526337da0&created=1671084403344&expire=1671087059960; _gat_gtag_UA_1460625_2=1; _gat_UA-1460625-2=1',
        Origin: 'https://finance.vietstock.vn',
        Referer: 'https://finance.vietstock.vn/vpb/thong-ke-giao-dich.htm',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'sec-ch-ua':
          '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
      }),
    },
  });
  if (res.data) {
    const transaction_upto_1_bil: any = [];
    const transaction_above_1_bil: any = [];

    res.data.forEach((item: any) => {
      if (item.Vol * item.Price > UNIT_BILLION) {
        transaction_above_1_bil.push(item);
      } else {
        transaction_upto_1_bil.push(item);
      }
    });

    return {
      transaction_above_1_bil,
      transaction_upto_1_bil,
      symbol,
      key: symbol,
    };
  }
  return null;
};

export const updateWatchlist = async (watchlistObj: any, updateData: any) => {
  return axios({
    method: 'PUT',
    url: `https://restv2.fireant.vn/me/watchlists/${watchlistObj.watchlistID}`,
    headers: {
      authorization:
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTEzNzE1ODY4LCJuYmYiOjE2MTM3MTU4NjgsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2MTM3MTU4NjcsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiYzZmNmNkZWE2MTcxY2Q5NGRiNWZmOWZkNDIzOWM0OTYiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.oZ8S_sTP6qVRJqY4h7g0JvXVPB0k8tm4go9pUFD0sS_sDZbC6zjelAVVNGHWJja82ewJbUEmTJrnDWAKR-rg5Pprp4DW7MzaN0lw3Bw0wEacphtyglx-H14-0Wnv_-2KMyQLP5EYH8wgyiw9I3ig_i7kHJy-XgCd__tdoMKvarkIXPzJJJY32gq-LScWb3HyZsfEdi-DEZUUzjAHR1nguY8oNmCiA6FaQCzOBU_qfgmOLWhN9ZNN1G3ODAeoOnphLJuWjHIrwPuVXy6B39eU2PtHmujtw_YOXdIWEi0lRhqV1pZOrJEarQqjdV3K5XNwpGvONT8lvUwUYGoOwwBFJg',
    },
    data: updateData,
  });
};
