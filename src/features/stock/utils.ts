import moment from 'moment';
import axios from 'axios';
import {
  NoDataKeys,
  HistoricalQuoteKeys,
  DATE_FORMAT,
  FundamentalKeys,
  FinancialIndicatorsKeys,
  LIST_VN30,
  UNIT_BILLION,
} from './constants';
import { min, max } from 'lodash';

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
      res.data.slice(1, 6).reduce((a: any, b: any) => a + b.totalVolume, 0) / 5;

    const changeVolume_last5 =
      (res.data[0].totalVolume - averageVolume_last5) / averageVolume_last5;

    const averageVolume_last20 =
      res.data.slice(1, 21).reduce((a: any, b: any) => a + b.totalVolume, 0) /
      20;

    const changeVolume_last20 =
      (res.data[0].totalVolume - averageVolume_last20) / averageVolume_last20;

    const changePrice =
      (last_data.priceClose - last_2_data.priceClose) / last_2_data.priceClose;
    const count_5_day_within_base = calculateBase(res.data.slice(1, 6));
    const count_10_day_within_base = calculateBase(res.data.slice(1, 11));
    // let count_5_day_within_base: any = {
    //   count: 0,
    //   list: [],
    //   valid: false,
    // };
    // count the number of dasy which percent price is within the min and max from the base today

    // base --> calculate from last_2_day
    // const base = last_2_data.priceClose;
    // let min_base = base - base * 0.07; // 7% up from last_2_day
    // let max_base = base + base * 0.07; // 7% up from last_2_day

    // const last_5_data = res.data.slice(1, 6);

    // last_5_data.forEach((item: any) => {
    //   if (item.priceClose >= min_base && item.priceClose <= max_base) {
    //     count_5_day_within_base.count += 1;
    //     count_5_day_within_base.list.push(item);
    //   } else {
    //     return;
    //   }
    //   if (count_5_day_within_base.count === 5) {
    //     count_5_day_within_base.valid = true;
    //   }
    // });

    // let count_10_day_within_base = {
    //   count: 0,
    //   valid: false,
    // };
    // // count the number of dasy which percent price is within the min and max from the base today

    const last_10_data = res.data.slice(1, 11);

    // last_10_data.forEach((item: any) => {
    //   if (item.priceClose >= min_base && item.priceClose <= max_base) {
    //     count_10_day_within_base.count += 1;
    //   }
    //   if (count_10_day_within_base.count === 10) {
    //     count_10_day_within_base.valid = true;
    //   }
    // });

    const strong_sell: any = [];
    const strong_buy: any = [];

    const averageVolume_last10 =
      last_10_data.reduce((a: any, b: any) => a + b.totalVolume, 0) / 10;

    last_10_data.forEach((i: any, index: number) => {
      if (index === 9) return;

      const last_price = last_10_data[index + 1].priceClose;
      let isSell = false;
      let isBuy = false;

      i.last_price = last_price;
      // Check if it is the sell or buy
      // Normal case is priceClose > priceOpen --> buy

      // Special case: hammer candle
      const upperHammer = Number(
        (
          (100 *
            (i.priceHigh -
              (i.priceClose > i.priceOpen ? i.priceClose : i.priceOpen))) /
          last_price
        ).toFixed(1)
      );

      const lowerHammer = Number(
        (
          (100 *
            ((i.priceClose < i.priceOpen ? i.priceClose : i.priceOpen) -
              i.priceLow)) /
          last_price
        ).toFixed(1)
      );

      if (
        i.priceClose > last_price * 1.03 ||
        (lowerHammer > 3 && upperHammer < 1)
      ) {
        isBuy = true;
      }
      if (
        i.priceClose < last_price * 0.97 ||
        (upperHammer > 3 && lowerHammer < 1)
      ) {
        isSell = true;
      }

      let strong_volume = false;
      // Check if volume is strong
      if (i.totalVolume > averageVolume_last10) {
        strong_volume = true;
      }

      if (strong_volume && isBuy) {
        strong_buy.push(i);
      }
      if (strong_volume && isSell) {
        strong_sell.push(i);
      }
      if (i.symbol === 'GEX') {
        console.log({
          date: i.date,
          upperHammer,
          lowerHammer,
          priceHigh: i.priceHigh,
          priceLow: i.priceLow,
          last_price,
          priceClose: i.priceClose,
          priceOpen: i.priceOpen,
        });
      }
    });

    const last_10_day_summary: any = {
      strong_buy,
      strong_sell,
    };

    const test_in_day_review = 123;

    const start_time = moment().set('hour', 9).set('minute', 0);
    const default_end_time = moment().set('hour', 14).set('minute', 45);
    const default_diff_time = default_end_time.diff(start_time, 'minute') - 90;

    const end_time = moment();
    let diff_time = 0;
    if (end_time.isBefore(moment('11:30', 'HH:mm'))) {
      diff_time = end_time.diff(start_time, 'minute');
    } else if (end_time.isAfter(moment('13:00', 'HH:mm'))) {
      diff_time = end_time.diff(start_time, 'minute') - 90;
    } else {
      diff_time =
        end_time.diff(start_time, 'minute') -
        end_time.diff(moment('11:30', 'HH:mm'), 'minute');
    }
    const estimated_vol =
      (last_data.dealVolume * default_diff_time) / diff_time;
    const estimated_vol_change =
      (100 * (estimated_vol - averageVolume_last5)) / averageVolume_last5;

    const extra_vol = (100 * last_data.putthroughVolume) / last_data.dealVolume;

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
      count_10_day_within_base,
      last_10_day_summary,
      test_in_day_review,
      estimated_vol,
      estimated_vol_change,
      extra_vol,
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
  //svr9.fireant.vn/api/Data/Markets/IntradayQuotes?symbol=C4G
  const res = await axios({
    method: 'GET',
    //  headers: {
    //    Authorization:
    //      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTEzNjIzMDMyLCJuYmYiOjE2MTM2MjMwMzIsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2MTM2MjMwMzIsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiZmIyZWJkNzAzNTBiMDBjMGJhMWE5ZDA5NGUwNDMxMjYiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.OhgGCRCsL8HVXSueC31wVLUhwWWPkOu-yKTZkt3jhdrK3MMA1yJroj0Y73odY9XSLZ3dA4hUTierF0LxcHgQ-pf3UXR5KYU8E7ieThAXnIPibWR8ESFtB0X3l8XYyWSYZNoqoUiV9NGgvG2yg0tQ7lvjM8UYbiI-3vUfWFsMX7XU3TQnhxW8jYS_bEXEz7Fvd_wQbjmnUhQZuIVJmyO0tFd7TGaVipqDbRdry3iJRDKETIAMNIQx9miHLHGvEqVD5BsadOP4l8M8zgVX_SEZJuYq6zWOtVhlq3uink7VvnbZ7tFahZ4Ty4z8ev5QbUU846OZPQyMlEnu_TpQNpI1hg',
    //  },
    url: `https://svr9.fireant.vn/api/Data/Markets/IntradayQuotes?symbol=${symbol}`,
  });

  if (res.data) {
    const transaction_upto_1_bil: any = [];
    const transaction_above_1_bil: any = [];
    let total_buy_vol = 0;
    let total_sell_vol = 0;
    let buy_count = 0;
    let sell_count = 0;

    const buy_summary = {
      key: 'buy',
      _filter_1: 0,
      _filter_2: 0,
      _filter_3: 0,
      _filter_4: 0,
      _filter_5: 0,
    };

    const sell_summary = {
      key: 'sell',
      _filter_1: 0,
      _filter_2: 0,
      _filter_3: 0,
      _filter_4: 0,
      _filter_5: 0,
    };

    res.data.forEach((item: any) => {
      const newItem = { ...item };
      // remove properties ID, Symbol, TotalVolume
      delete newItem.ID;
      delete newItem.Symbol;
      delete newItem.TotalVolume;

      if (newItem.Volume * newItem.Price > UNIT_BILLION) {
        transaction_above_1_bil.push(newItem);
      } else {
        transaction_upto_1_bil.push(newItem);
      }

      if (newItem.Side === 'B') {
        total_buy_vol += newItem.Volume;
        buy_count += 1;
      }
      if (newItem.Side === 'S') {
        total_sell_vol += newItem.Volume;
        sell_count += 1;
      }

      const total = (newItem.Volume * newItem.Price) / UNIT_BILLION;

      if (newItem.Side === 'B') {
        if (total < 0.1) {
          buy_summary._filter_1 += 1;
        } else if (0.1 <= total && total < 0.5) {
          buy_summary._filter_2 += 1;
        } else if (0.5 <= total && total < 1) {
          buy_summary._filter_3 += 1;
        } else if (1 <= total && total < 2) {
          buy_summary._filter_4 += 1;
        } else {
          buy_summary._filter_5 += 1;
        }
      }

      if (newItem.Side === 'S') {
        if (total < 0.1) {
          sell_summary._filter_1 += 1;
        } else if (0.1 <= total && total < 0.5) {
          sell_summary._filter_2 += 1;
        } else if (0.5 <= total && total < 1) {
          sell_summary._filter_3 += 1;
        } else if (1 <= total && total < 2) {
          sell_summary._filter_4 += 1;
        } else {
          sell_summary._filter_5 += 1;
        }
      }
    });

    const transaction_summary = [buy_summary, sell_summary];

    const buy_sell_vol = {
      total_buy_vol,
      total_sell_vol,
      buy_count,
      sell_count,
      buy_sell_count_ratio: Number((buy_count / sell_count).toFixed(1)),
      buy_sell_total_ratio: Number((total_buy_vol / total_sell_vol).toFixed(1)),
    };

    return {
      transaction_summary,
      transaction_above_1_bil,
      transaction_upto_1_bil,
      buy_sell_vol,
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

export const getFilterData = (
  data: any,
  {
    currentWatchlist,
    totalValue_last20_min,
    totalValue_last20_max,
    changeVolume_last5_min,
    changeVolume_last5_max,
    changeVolume_last20_min,
    changeVolume_last20_max,
    changePrice_min,
    changePrice_max,
    excludeVN30,
    validCount_5_day_within_base,
    transaction_above_1_bil_min,
    transaction_above_1_bil_max,
    estimated_vol_change_min,
    estimated_vol_change_max,
  }: any
) => {
  const filteredData = data.filter((i: any) => {
    if (
      currentWatchlist &&
      currentWatchlist.symbols &&
      !currentWatchlist.symbols.includes(i.symbol)
    ) {
      return false;
    }

    if (i.totalValue_last20_min < totalValue_last20_min * UNIT_BILLION) {
      return false;
    }

    if (i.totalValue_last20_max > totalValue_last20_max * UNIT_BILLION) {
      return false;
    }

    if (i.changeVolume_last5 * 100 < changeVolume_last5_min) {
      return false;
    }

    if (i.changeVolume_last5 * 100 > changeVolume_last5_max) {
      return false;
    }

    if (i.changeVolume_last20 * 100 < changeVolume_last20_min) {
      return false;
    }

    if (i.changeVolume_last20 * 100 > changeVolume_last20_max) {
      return false;
    }

    if (i.changePrice * 100 < changePrice_min) {
      return false;
    }

    if (i.changePrice * 100 > changePrice_max) {
      return false;
    }

    if (excludeVN30 && LIST_VN30.includes(i.symbol)) {
      return false;
    }

    if (
      validCount_5_day_within_base &&
      i.count_5_day_within_base &&
      !i.count_5_day_within_base.valid
    ) {
      return false;
    }

    if (
      i.transaction_above_1_bil &&
      i.transaction_above_1_bil.length < transaction_above_1_bil_min
    ) {
      return false;
    }

    if (
      i.transaction_above_1_bil &&
      i.transaction_above_1_bil.length > transaction_above_1_bil_max
    ) {
      return false;
    }

    if (i.estimated_vol_change < estimated_vol_change_min) {
      return false;
    }

    if (i.estimated_vol_change > estimated_vol_change_max) {
      return false;
    }

    return true;
  });
  return filteredData;
};

const calculateBase = (data: any) => {
  if (!data || data.length === 0) return null;
  let list_base: any = [];
  let index_base;

  data.forEach((_: any, index: number) => {
    if (
      !data[index + 1] ||
      !data[index + 2] ||
      !data[index + 3] ||
      !data[index + 4]
    )
      return;
    if (list_base.length === 5) return;
    const base_min = min([
      data[index].priceLow,
      data[index + 1].priceLow,
      data[index + 2].priceLow,
      data[index + 3].priceLow,
      data[index + 4].priceLow,
    ]);
    const base_max = max([
      data[index].priceHigh,
      data[index + 1].priceHigh,
      data[index + 2].priceHigh,
      data[index + 3].priceHigh,
      data[index + 4].priceHigh,
    ]);
    const percent = (100 * (base_max - base_min)) / base_min;
    if (percent < 14) {
      list_base = [
        data[index],
        data[index + 1],
        data[index + 2],
        data[index + 3],
        data[index + 4],
      ];
      index_base = index;
    }
  });

  return {
    list_base,
    index_base,
  };
};
