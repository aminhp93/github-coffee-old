import { max, min, meanBy, uniq, cloneDeep } from 'lodash';
import moment from 'moment';
import {
  DATE_FORMAT,
  UNIT_BILLION,
  NO_DATA_COLUMN,
  HISTORICAL_QUOTE_COLUMN,
  FUNDAMENTAL_COLUMN,
  FINANCIAL_INDICATORS_COLUMN,
  BACKTEST_FILTER,
} from './constants';
import {
  HistoricalQuote,
  ExtraData,
  ActionType,
  Watchlist,
  CustomSymbol,
  Filter,
  BackTestSymbol,
  Base,
} from './types';
import BuySellSignalsColumns from './StockTable/BuySellSignalsColumns';
import InDayReviewColumns from './StockTable/InDayReviewColumns';

export const mapHistoricalQuote = (
  data: HistoricalQuote[],
  extraData: ExtraData
): CustomSymbol => {
  const last_data = data[0];
  const last_2_data = data[1];
  const totalValue_last20_min = Math.min(
    ...data.map((item: HistoricalQuote) => item.totalValue)
  );

  const averageVolume_last5 =
    data
      .slice(1, 6)
      .reduce((a: number, b: HistoricalQuote) => a + b.totalVolume, 0) / 5;

  const changeVolume_last5 =
    (data[0].totalVolume - averageVolume_last5) / averageVolume_last5;

  const changePrice =
    (100 * (last_data.priceClose - last_2_data.priceClose)) /
    last_2_data.priceClose;

  const count_5_day_within_base = getListBase({
    data: data.slice(1, 6),
    limit: 1,
  });

  const count_10_day_within_base = getListBase({
    data: data.slice(1, 11),
    limit: 1,
  });

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

  const last20HistoricalQuote: BackTestSymbol[] = data.map(
    (i: HistoricalQuote) => {
      return {
        date: i.date,
        dealVolume: i.dealVolume,
        priceClose: i.priceClose,
        priceHigh: i.priceHigh,
        priceLow: i.priceLow,
        priceOpen: i.priceOpen,
        totalVolume: i.totalVolume,
        symbol: i.symbol,
      };
    }
  );

  return {
    ...extraData,
    last20HistoricalQuote,
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
    backtest: null,
  };
};

export const mapFundamentals = (data: any, extraData: any) => {
  if (!data) return null;
  return {
    ...data,
    ...extraData,
  };
};

export const getListBase = ({
  data,
  limit,
}: {
  data: BackTestSymbol[];
  limit?: number;
}): Base[] => {
  let listBase: Base[] = [];

  data.forEach((_: BackTestSymbol, index: number) => {
    if (
      !data[index + 1] ||
      !data[index + 2] ||
      !data[index + 3] ||
      !data[index + 4]
    )
      return;
    if (limit && listBase.length === limit) return;
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
    if (base_max && base_min) {
      const percent = (100 * (base_max - base_min)) / base_min;
      if (percent < 14) {
        const list = [
          data[index],
          data[index + 1],
          data[index + 2],
          data[index + 3],
          data[index + 4],
        ];
        let buyIndex = null;

        const averageVolume = meanBy(list, 'totalVolume');
        let change_t0_vol = null;
        let change_t0 = null;
        let change_t3 = null;
        let change_buyPrice = BACKTEST_FILTER.change_buyPrice;

        if (data[index - 1] && data[index - 4]) {
          buyIndex = index - 1;
          change_t0_vol =
            (100 * (data[buyIndex].totalVolume - averageVolume)) /
            averageVolume;
          change_t0 =
            (100 * (data[buyIndex].priceClose - list[0].priceClose)) /
            list[0].priceClose;

          const t3Price = data[index - 4].priceClose;
          const buyPrice =
            data[buyIndex].priceClose *
            (1 + BACKTEST_FILTER.change_buyPrice / 100);

          change_t3 = (100 * (t3Price - buyPrice)) / buyPrice;
        }

        listBase.push({
          list,
          buyIndex,
          fullData: data,
          change_t0_vol,
          change_t0,
          change_t3,
          change_buyPrice,
        });
      }
    }
  });

  return listBase;
};

export const getMapBackTestData = (
  res: BackTestSymbol[],
  fullDataSource: CustomSymbol[]
) => {
  const flattenRes = res;
  const newDataSource = [...fullDataSource];
  newDataSource.forEach((i: CustomSymbol) => {
    // get data with selected symbol
    const filterRes: BackTestSymbol[] = flattenRes
      .filter((j: BackTestSymbol) => j.symbol === i.symbol)
      .sort((a: BackTestSymbol, b: BackTestSymbol) =>
        b.date.localeCompare(a.date)
      );

    if (filterRes.length) {
      const listBase = getListBase({ data: filterRes });

      i.backtest = getBackTest(listBase, {
        change_t0: BACKTEST_FILTER.change_t0,
        change_t0_vol: BACKTEST_FILTER.change_t0_vol,
      });
    }
  });

  return newDataSource;
};

export const getDataChart = (
  data: BackTestSymbol[],
  buyItem: BackTestSymbol | null,
  volumeField: 'dealVolume' | 'totalVolume' = 'totalVolume'
) => {
  const newData = [...data];
  const dates = newData
    .map((i: BackTestSymbol) => moment(i.date).format(DATE_FORMAT))
    .reverse();
  const prices = newData
    .map((i: BackTestSymbol) => [
      i.priceOpen,
      i.priceClose,
      i.priceLow,
      i.priceHigh,
      i[volumeField],
    ])
    .reverse();
  const volumes = newData
    .reverse()
    .map((i: BackTestSymbol, index: number) => [
      index,
      i[volumeField],
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
    data: buyItem
      ? [
          {
            name: 'Mark',
            coord: [
              moment(buyItem.date).format(DATE_FORMAT),
              buyItem.priceOpen,
            ],
            value: buyItem.priceOpen,
            itemStyle: {
              color: 'blue',
            },
          },
        ]
      : [],
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
}: {
  changePrice: number;
  count_5_day_within_base: Base[];
  estimated_vol_change: number;
  extraData: ExtraData;
}): ActionType => {
  let action: ActionType = 'unknown';

  if (
    changePrice > 2 &&
    count_5_day_within_base.length === 1 &&
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
  if (changePrice < -2 && extraData?.inWatchingWatchList) {
    action = 'sell';
  }

  return action;
};

const getEstimatedVol = ({ last_data }: any) => {
  if (last_data.symbol === 'HVN') {
    console.log('HVN');
  }
  const start_time = moment().set('hour', 9).set('minute', 0);
  const default_end_time = moment().set('hour', 14).set('minute', 45);
  const default_diff_time = default_end_time.diff(start_time, 'minute') - 90;

  const end_time = moment();
  let diff_time = 0;
  if (end_time.isBefore(moment('11:30', 'HH:mm'))) {
    diff_time = end_time.diff(start_time, 'minute');
  } else if (
    end_time.isAfter(moment('13:00', 'HH:mm')) &&
    end_time.isBefore(moment('14:45', 'HH:mm'))
  ) {
    diff_time = end_time.diff(start_time, 'minute') - 90;
  } else {
    diff_time =
      end_time.diff(start_time, 'minute') -
      end_time.diff(moment('11:30', 'HH:mm'), 'minute');
  }
  let estimated_vol = (last_data.dealVolume * default_diff_time) / diff_time;
  if (
    moment(last_data.date).format(DATE_FORMAT) !==
      moment().format(DATE_FORMAT) ||
    (moment(last_data.date).format(DATE_FORMAT) !==
      moment().format(DATE_FORMAT) &&
      end_time.isAfter(moment('15:00', 'HH:mm')))
  ) {
    estimated_vol = last_data.dealVolume;
  }

  return estimated_vol;
};

const getLast10DaySummary = ({
  last_10_data,
}: {
  last_10_data: HistoricalQuote[];
}) => {
  const strong_sell: BackTestSymbol[] = [];
  const strong_buy: BackTestSymbol[] = [];

  const averageVolume_last10 =
    last_10_data.reduce(
      (a: number, b: HistoricalQuote) => a + b.totalVolume,
      0
    ) / 10;

  last_10_data.forEach((i: HistoricalQuote, index: number) => {
    if (index === 9) return;

    const last_price = last_10_data[index + 1].priceClose;
    let isSell = false;
    let isBuy = false;

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

export const getListAllSymbols = (listWatchlist: Watchlist[]) => {
  // get list all symbol from all watchlist
  const LIST_WATCHLIST_INCLUDES = [
    476435, // 1757_thep
    476706, // 8355_ngan_hang
    476714, // 8633_dau_co_va_BDS
    476720, // 8781_chung_khoan
    476724, // 0533_dau_khi
    737544, // thanh_khoan_vua
    927584, // dau tu cong
  ];
  let listAllSymbols = listWatchlist
    .filter((i: Watchlist) => LIST_WATCHLIST_INCLUDES.includes(i.watchlistID))
    .reduce((acc: any, item: any) => {
      return [...acc, ...item.symbols];
    }, []);

  // unique listAllSYmbols
  listAllSymbols = uniq(listAllSymbols);
  return listAllSymbols;
};

export const getDataSource = (data: CustomSymbol[], filter: Filter) => {
  const {
    currentWatchlist,
    totalValue_last20_min,
    changePrice_min,
    changePrice_max,
    only_buy_sell,
    estimated_vol_change_min,
  } = filter;

  const newData = cloneDeep(data);

  const result = newData.filter((i: CustomSymbol) => {
    if (i.symbol === 'HVN') {
      console.log('HVN');
    }
    if (
      currentWatchlist &&
      currentWatchlist.symbols &&
      !currentWatchlist.symbols.includes(i.symbol)
    ) {
      return false;
    }

    if (
      i.buySellSignals?.totalValue_last20_min <
      totalValue_last20_min * UNIT_BILLION
    ) {
      return false;
    }

    if (i.buySellSignals?.changePrice < changePrice_min) {
      return false;
    }

    if (i.buySellSignals?.changePrice > changePrice_max) {
      return false;
    }

    if (only_buy_sell && i.buySellSignals?.action === 'unknown') {
      return false;
    }

    if (
      estimated_vol_change_min &&
      i.buySellSignals?.estimated_vol_change < estimated_vol_change_min
    ) {
      return false;
    }

    return true;
  });

  result.sort((a: CustomSymbol, b: CustomSymbol) => {
    if (
      a.buySellSignals?.action === 'sell' &&
      b.buySellSignals?.action === 'unknown'
    )
      return -1;
    if (
      a.buySellSignals?.action === 'sell' &&
      b.buySellSignals?.action === 'buy'
    )
      return -1;
    if (
      a.buySellSignals?.action === 'buy' &&
      b.buySellSignals?.action === 'unknown'
    )
      return -1;
    // next sort by backtest winrate desc
    if (
      a.buySellSignals?.action === 'buy' &&
      b.buySellSignals?.action === 'buy' &&
      a.backtest &&
      b.backtest
    ) {
      if (a.backtest.winRate > b.backtest.winRate) return -1;
    }

    return 0;
  });

  return result;
};

export const getColumns = (checkedList: any) => {
  const columns: any = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      sorter: (a: any, b: any) => a['symbol'].localeCompare(b['symbol']),
    },
  ];
  if (checkedList.includes('HistoricalQuote')) {
    columns.push({
      title: 'Historical Quotes',
      children: HISTORICAL_QUOTE_COLUMN,
    });
  }

  if (checkedList.includes('Fundamental')) {
    columns.push({
      title: 'Fundamentals',
      children: FUNDAMENTAL_COLUMN,
    });
  }

  if (checkedList.includes('FinancialIndicators')) {
    columns.push({
      title: 'FinancialIndicators',
      children: FINANCIAL_INDICATORS_COLUMN,
    });
  }

  if (checkedList.includes('BuySellSignals')) {
    columns.push({
      title: 'BuySellSignals',
      children: BuySellSignalsColumns(),
    });
  }

  if (checkedList.includes('NoData')) {
    columns.push({
      title: 'NoData',
      children: NO_DATA_COLUMN,
    });
  }

  if (checkedList.includes('InDayReview')) {
    columns.push({
      title: 'InDayReview',
      children: InDayReviewColumns,
    });
  }

  return columns;
};

export const getBackTest = (
  listBase: Base[],
  filterCondition: {
    change_t0: number;
    change_t0_vol: number;
  }
) => {
  const filteredBase = listBase.filter(
    (j: Base) =>
      j.change_t0! > filterCondition.change_t0 &&
      j.change_t0_vol! > filterCondition.change_t0_vol
  );
  const winCount = filteredBase.filter((j: Base) => j.change_t3! > 0).length;
  const winRate = Number(((100 * winCount) / filteredBase.length).toFixed(2));

  return {
    filteredBase,
    listBase,
    winCount,
    winRate,
  };
};
