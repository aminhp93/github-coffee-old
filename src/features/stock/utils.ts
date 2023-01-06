import { max, min, meanBy } from 'lodash';
import moment from 'moment';
import { DATE_FORMAT, UNIT_BILLION } from './constants';
import {
  BuySellSignals,
  HistoricalQuote,
  ExtraData,
  CustomHistoricalQuote,
  ActionType,
} from './types';

export const mapHistoricalQuote = (
  data: HistoricalQuote[],
  extraData: ExtraData
): CustomHistoricalQuote => {
  const last_data = data[0];
  const last_2_data = data[1];
  const totalValue_last20_min = Math.min(
    ...data.map((item: any) => item.totalValue)
  );

  const averageVolume_last5 =
    data.slice(1, 6).reduce((a: any, b: any) => a + b.totalVolume, 0) / 5;

  const changeVolume_last5 =
    (data[0].totalVolume - averageVolume_last5) / averageVolume_last5;

  const changePrice =
    (last_data.priceClose - last_2_data.priceClose) / last_2_data.priceClose;

  const count_5_day_within_base = calculateBase(data.slice(1, 6), 1);

  const count_10_day_within_base = calculateBase(data.slice(1, 11), 1);

  const last_10_data = data.slice(1, 11);

  const last_10_day_summary = getLast10DaySummary({ last_10_data });

  const estimated_vol = getEstimatedVol({ last_data });

  const estimated_vol_change =
    (100 * (estimated_vol - averageVolume_last5)) / averageVolume_last5;

  const extra_vol =
    (100 * last_data.putthroughVolume) / (last_data.dealVolume || 1);

  const action = getAction({
    changePrice,
    count_5_day_within_base,
    estimated_vol_change,
    extraData,
  });

  return {
    ...extraData,
    latestHistoricalQuote: last_data,
    buySellSignals: {
      totalValue_last20_min,
      averageVolume_last5,
      changeVolume_last5,
      changePrice,
      count_5_day_within_base,
      count_10_day_within_base,
      last_10_day_summary,
      estimated_vol_change,
      extra_vol,
      action,
    },
  };
};

export const mapFundamentals = (data: any, extraData: any) => {
  if (!data) return null;
  return {
    ...data,
    ...extraData,
  };
};

export const getFilterData = (
  data: any,
  {
    currentWatchlist,
    totalValue_last20_min,
    changePrice_min,
    changePrice_max,
    only_buy_sell,
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

  // Sort data based on action is sell, buy
  const sortedData = returnData.sort((a: any, b: any) => {
    if (a.action === 'sell' && !b.action) return -1;
    if (a.action === 'sell' && b.action === 'buy') return -1;
    if (a.action === 'buy' && !b.action) return -1;
    // next sort by backtest winrate desc
    if (a.action === 'buy' && b.action === 'buy' && a.backtest && b.backtest) {
      if (Number(a.backtest.winRate) > Number(b.backtest.winRate)) return -1;
    }

    return 0;
  });

  return sortedData;
};

export const calculateBase = (data: any, limit?: number) => {
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
      });
    }
  });

  return {
    list_base,
  };
};

export const getMapBackTestData = (res: any, dataSource: any) => {
  const flattenRes = res;
  const newDataSource = [...dataSource];
  newDataSource.forEach((i: any) => {
    // get data with selected symbol
    const filterRes = flattenRes
      .filter((j: any) => j.symbol === i.symbol)
      .sort((a: any, b: any) => b.date.localeCompare(a.date));

    if (filterRes.length) {
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
    }
  });

  return newDataSource;
};

const getMapListBase = (old_list: any, full_data: any) => {
  console.log('getMapListBase', old_list);
  const new_list = old_list.map((i: any) => {
    const baseIndex = full_data.findIndex(
      (j: any) => j.date === i.list[0].date
    );
    // Ignore base if baseIndex > 5
    if (baseIndex > 5) {
      i.index = baseIndex;
      i.buyItem = full_data[i.index - 1];
      i.addedData = [
        full_data[i.index - 4], // t3
        full_data[i.index - 3], // t2
        full_data[i.index - 2], // t1
        full_data[i.index - 1], // t0
      ];

      // full data have next 10 days and previous 30 days
      i.fullData = full_data.slice(i.index - 10, i.index + 30);

      // average volume of list base
      const averageVolume = meanBy(i.list, 'totalVolume');

      i.estimated_vol_change = i.buyItem.totalVolume / averageVolume;
      i.estimated_price_change = i.buyItem.priceClose / i.list[0].priceClose;
      const buyPrice = full_data[i.index].priceClose * 1.02;

      const t3Price = full_data[i.index - 4].priceClose;
      i.t3 = (100 * (t3Price - buyPrice)) / buyPrice;
    }

    return i;
  });

  const filter_list = new_list.filter(
    (j: any) => j.estimated_vol_change > 1.2 && j.estimated_price_change > 1.02
  );

  return filter_list;
};

export const getDataChart = (data: any, buyItem: any) => {
  const dates: any = data
    .map((i: any) => moment(i.date).format(DATE_FORMAT))
    .reverse();
  const prices: any = data
    .map((i: any) => [
      i.priceOpen,
      i.priceClose,
      i.priceLow,
      i.priceHigh,
      i.totalVolume,
    ])
    .reverse();
  const volumes: any = data
    .reverse()
    .map((i: any, index: number) => [
      index,
      i.totalVolume,
      i.priceOpen < i.priceClose ? 1 : -1,
    ]);

  const seriesMarkPoint = {
    symbol: 'arrow',
    symbolSize: 10,
    symbolOffset: [0, 10],
    label: {
      formatter: function (param: any) {
        return '';
      },
    },
    data: [
      {
        name: 'Mark',
        coord: [moment(buyItem.date).format(DATE_FORMAT), buyItem.priceOpen],
        value: buyItem.priceOpen,
        itemStyle: {
          color: 'blue',
        },
      },
    ],
  };

  return {
    dates,
    prices,
    volumes,
    seriesMarkPoint,
  };
};

const getAction = ({
  changePrice,
  count_5_day_within_base,
  estimated_vol_change,
  extraData,
}: any): ActionType => {
  let action: ActionType = 'unknown';

  if (
    changePrice > 0.02 &&
    count_5_day_within_base?.list_base.length === 1 &&
    estimated_vol_change > 20
  ) {
    action = 'buy';
  }

  // BUY 2
  // 1. Have base: base_count > 0
  // 2. Price change > 2%

  // SELL
  // 1. in watching watchlist
  // 2. Price change < -2%
  if (changePrice < -0.02 && extraData?.inWatchingWatchList) {
    action = 'sell';
  }

  return action;
};

const getEstimatedVol = ({ last_data }: any) => {
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

  return estimated_vol;
};

const getLast10DaySummary = ({ last_10_data }: any) => {
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
  return {
    strong_buy,
    strong_sell,
  };
};
