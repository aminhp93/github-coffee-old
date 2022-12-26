import axios from 'axios';
import { indexOf, max, min, sortBy, meanBy } from 'lodash';
import moment from 'moment';
import { DATE_FORMAT, UNIT_BILLION } from './constants';

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

export const mapHistoricalQuote = (data: any, extraData: any) => {
  if (!data) return null;

  const last_data = data[0];
  const last_2_data = data[1];
  const last_20_day_historical_quote = data;
  const totalValue_last20_min = Math.min(
    ...data.map((item: any) => item.totalValue)
  );
  const totalValue_last20_max = Math.max(
    ...data.map((item: any) => item.totalValue)
  );

  const averageVolume_last5 =
    data.slice(1, 6).reduce((a: any, b: any) => a + b.totalVolume, 0) / 5;

  const changeVolume_last5 =
    (data[0].totalVolume - averageVolume_last5) / averageVolume_last5;

  const averageVolume_last20 =
    data.slice(1, 21).reduce((a: any, b: any) => a + b.totalVolume, 0) / 20;

  const changeVolume_last20 =
    (data[0].totalVolume - averageVolume_last20) / averageVolume_last20;

  const changePrice =
    (last_data.priceClose - last_2_data.priceClose) / last_2_data.priceClose;

  const count_5_day_within_base = calculateBase(data.slice(1, 6), 1);
  const count_10_day_within_base = calculateBase(data.slice(1, 11), 1);

  const last_10_data = data.slice(1, 11);

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
  let estimated_vol = (last_data.dealVolume * default_diff_time) / diff_time;
  if (
    moment(last_data.date).format(DATE_FORMAT) !== moment().format(DATE_FORMAT)
  ) {
    estimated_vol = last_data.dealVolume;
  }
  const estimated_vol_change =
    (100 * (estimated_vol - averageVolume_last5)) / averageVolume_last5;

  const extra_vol =
    (100 * last_data.putthroughVolume) / (last_data.dealVolume || 1);

  return {
    ...extraData,
    ...last_data,
    totalValue_last20_min,
    last_20_day_historical_quote,
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
};

export const mapFundamentals = (data: any, extraData: any) => {
  if (!data) return null;
  return {
    ...data,
    ...extraData,
  };
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

export const getDailyTransaction = async (symbol: string) => {
  if (!symbol) return;
  const res = await axios({
    method: 'GET',
    url: `https://svr9.fireant.vn/api/Data/Markets/IntradayQuotes?symbol=${symbol}`,
  });

  if (res.data) {
    const transaction_upto_1_bil: any = [];
    const transaction_above_1_bil: any = [];
    // let total_buy_vol = 0;
    // let total_sell_vol = 0;
    // let buy_count = 0;
    // let sell_count = 0;

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

      // if (newItem.Side === 'B') {
      //   total_buy_vol += newItem.Volume;
      //   buy_count += 1;
      // }
      // if (newItem.Side === 'S') {
      //   total_sell_vol += newItem.Volume;
      //   sell_count += 1;
      // }

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

    // const transaction_summary = [buy_summary, sell_summary];

    // const buy_sell_vol = {
    //   total_buy_vol,
    //   total_sell_vol,
    //   buy_count,
    //   sell_count,
    //   buy_sell_count_ratio: Number((buy_count / sell_count).toFixed(1)),
    //   buy_sell_total_ratio: Number((total_buy_vol / total_sell_vol).toFixed(1)),
    // };

    return {
      // transaction_summary,
      // transaction_above_1_bil,
      // transaction_upto_1_bil,
      // buy_sell_vol,
      // symbol,
      // key: symbol,
      data: res.data,
    };
  }
  return null;
};

export const getFilterData = (
  data: any,
  {
    currentWatchlist,
    totalValue_last20_min,
    changePrice_min,
    changePrice_max,
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

    if (i.changePrice * 100 < changePrice_min) {
      return false;
    }

    if (i.changePrice * 100 > changePrice_max) {
      return false;
    }

    return true;
  });

  return filteredData;
};

export const mapBuySell = (data: any) => {
  if (!data || !data.length) return [];
  let returnData = data.map((i: any) => {
    // BUY 1
    // 1. Have base: base_count > 0
    // 2. Price change > 2%
    // 3. Break from base
    // 4. Volume change > 20%
    // 5. show backtest result within 1 year
    if (
      i.changePrice > 0.02 &&
      i.count_5_day_within_base.list_base.length === 1 &&
      i.estimated_vol_change > 20
    ) {
      i.action = 'buy';
    }

    // BUY 2
    // 1. Have base: base_count > 0
    // 2. Price change > 2%

    // SELL
    // 1. in watching watchlist
    // 2. Price change < -2%
    if (i.changePrice < -0.02 && i.inWatchingWatchList) {
      i.action = 'sell';
    }
    return i;
  });

  const order = ['buy', 'sell'];

  const sortedData = sortBy(returnData, (obj) => {
    return -indexOf(order, obj.action);
  });

  // Sort data based on action is sell, buy
  // returnData.sort((a: any, b: any) => {
  //   if (a.action === 'sell' && !b.action) return -1;
  //   if (a.action === 'sell' && b.action === 'buy') return -1;
  //   if (a.action === 'buy' && !b.action) return -1;
  //   return 0;
  // });

  console.log(sortedData);

  return sortedData;
};

export const calculateBase = (data: any, limit?: number) => {
  if (!data || data.length === 0) return null;
  let list_base: any = [];

  data.forEach((_: any, index: number) => {
    if (
      !data[index + 1] ||
      !data[index + 2] ||
      !data[index + 3] ||
      !data[index + 4]
    )
      return;
    if (limit && list_base.length === limit) return;
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
      list_base.push({
        list: [
          data[index],
          data[index + 1],
          data[index + 2],
          data[index + 3],
          data[index + 4],
        ],
        index,
      });
    }
  });

  return {
    list_base,
  };
};

export const getMapBackTestData = (res: any, dataSource: any) => {
  const flattenRes = res.flat();
  const newDataSource = [...dataSource];
  newDataSource.forEach((i: any) => {
    // get data with selected symbol
    const filterRes = flattenRes.filter((j: any) => j.symbol === i.symbol);

    // calculate list base
    const list_base = calculateBase(filterRes)?.list_base || [];

    // map more data to list base
    const map_list_base = getMapListBase(list_base, filterRes);

    const winCount = map_list_base.filter((j: any) => j.result > 0).length;

    i.backtest = {
      data: filterRes,
      list_base: map_list_base,
      winCount,
      winRate: ((100 * winCount) / map_list_base.length).toFixed(2),
    };
  });
  return newDataSource;
};

const getMapListBase = (old_list: any, full_data: any) => {
  const new_list = old_list.map((i: any) => {
    const averageVolume = meanBy(i.list, 'totalVolume');
    i.buyItem = full_data[i.index - 1];
    i.estimated_vol_change = i.buyItem.totalVolume / averageVolume;
    const buyPrice = full_data[i.index].priceClose * 1.02;
    const sellPrice = full_data[i.index - 4].priceClose;
    i.result = (100 * (sellPrice - buyPrice)) / buyPrice;

    return i;
  });

  const filter_list = new_list.filter((j: any) => j.estimated_vol_change > 1.2);

  return filter_list;
};
