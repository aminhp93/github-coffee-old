import { meanBy, cloneDeep } from 'lodash';
import moment from 'moment';
import {
  DATE_FORMAT,
  UNIT_BILLION,
  BACKTEST_FILTER,
  getAction,
  getEstimatedVol,
  getBase_min_max,
} from './constants';
import {
  HistoricalQuote,
  ExtraData,
  CustomSymbol,
  Filter,
  BackTestSymbol,
  Base,
  FilterBackTest,
} from './types';

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

  const latestBase = getLatestBase(data);

  const estimated_vol = getEstimatedVol(last_data);

  const estimated_vol_change =
    (100 * (estimated_vol - averageVolume_last5)) / averageVolume_last5;

  const extra_vol =
    (100 * last_data.putthroughVolume) / (last_data.dealVolume || 1);

  const action = getAction({
    changePrice,
    latestBase,
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
      latestBase,
      estimated_vol_change,
      extra_vol,
      action,
    },
    backtest: null,
  };
};

export const getListBase = (data: BackTestSymbol[]): Base[] => {
  if (!data || !data.length || data.length < 6) return [];
  let listBase: Base[] = [];
  // let nextIndex = 0;

  data.forEach((_: BackTestSymbol, index: number) => {
    if (index === 0 || index > data.length - 5) return;
    // nextIndex += 1;
    // if (index < nextIndex) return;

    const startBaseIndex = index;
    const endBaseIndex = index + 4;
    const list = [
      data[index],
      data[index + 1],
      data[index + 2],
      data[index + 3],
      data[index + 4],
    ];
    const { base_min, base_max } = getBase_min_max(list);
    if (!base_max || !base_min) return;

    const percent = (100 * (base_max - base_min)) / base_min;
    if (percent < 14) {
      let buyIndex = index - 1;

      const averageVolume = meanBy(list, 'totalVolume');
      const change_t0_vol =
        (100 * (data[buyIndex].totalVolume - averageVolume)) / averageVolume;
      const change_t0 =
        (100 * (data[buyIndex].priceClose - list[0].priceClose)) /
        list[0].priceClose;

      const change_buyPrice = BACKTEST_FILTER.change_buyPrice;
      const num_high_vol_than_t0 = list.filter(
        (i: BackTestSymbol) => i.totalVolume > data[buyIndex!].totalVolume
      ).length;

      let change_t3 = null;

      if (data[index - 4]) {
        const t3Price = data[index - 4].priceClose;
        const buyPrice =
          data[buyIndex].priceClose *
          (1 + BACKTEST_FILTER.change_buyPrice / 100);

        change_t3 = (100 * (t3Price - buyPrice)) / buyPrice;
      }

      listBase.push({
        buyIndex,
        startBaseIndex,
        endBaseIndex,
        change_t0_vol,
        change_t0,
        change_t3,
        change_buyPrice,
        num_high_vol_than_t0,
        base_max,
        base_min,
      });
      // nextIndex = nextIndex + list.length - 1;
    }
  });

  return listBase;
};

export const getMapBackTestData = (
  res: BackTestSymbol[],
  dataSource: CustomSymbol[],
  fullDataSource: CustomSymbol[]
) => {
  const flattenRes = res;
  const newDataSource = fullDataSource.map((i: CustomSymbol) => {
    const newItem = { ...i };
    const isIncluded = dataSource.map((j) => j.symbol).includes(i.symbol);
    if (!isIncluded) return newItem;

    const filterRes: BackTestSymbol[] = flattenRes
      .filter((j: BackTestSymbol) => j.symbol === i.symbol)
      .sort((a: BackTestSymbol, b: BackTestSymbol) =>
        b.date.localeCompare(a.date)
      );

    if (filterRes.length) {
      const listBase = getListBase(filterRes);
      newItem.backtest = getBackTest(filterRes, listBase, {
        change_t0: BACKTEST_FILTER.change_t0,
        change_t0_vol: BACKTEST_FILTER.change_t0_vol,
        num_high_vol_than_t0: BACKTEST_FILTER.num_high_vol_than_t0,
      });
    }

    return newItem;
  });

  return newDataSource;
};

export const getDataChart = ({
  data,
  volumeField = 'totalVolume',
  grid,
  seriesMarkPoint,
  markLine,
}: {
  data: BackTestSymbol[];
  volumeField?: 'dealVolume' | 'totalVolume';
  grid?: any;
  seriesMarkPoint?: any;
  markLine?: any;
}) => {
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

  const DEFAULT_GRID = [
    {
      left: 20,
      right: 20,
      top: 0,
      height: '70%',
    },
    {
      left: 20,
      right: 20,
      height: '20%',
      bottom: 0,
    },
  ];

  return {
    dates,
    prices,
    volumes,
    seriesMarkPoint: seriesMarkPoint ? seriesMarkPoint : null,
    grid: grid ? grid : DEFAULT_GRID,
    markLine: markLine ? markLine : null,
  };
};

export const getDataSource = (data: CustomSymbol[], filter: Filter) => {
  const {
    currentWatchlist,
    totalValue_last20_min,
    changePrice_min,
    only_buy_sell,
    estimated_vol_change_min,
  } = filter;

  const newData = cloneDeep(data);

  const result = newData.filter((i: CustomSymbol) => {
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

export const getBackTest = (
  fullData: BackTestSymbol[],
  listBase: Base[],
  filterCondition: FilterBackTest
) => {
  const filteredBase = listBase.filter(
    (j: Base) =>
      j.change_t0! > filterCondition.change_t0 &&
      j.change_t0_vol! > filterCondition.change_t0_vol &&
      j.num_high_vol_than_t0! === filterCondition.num_high_vol_than_t0
  );
  const winCount = filteredBase.filter((j: Base) => j.change_t3! > 0).length;
  const winRate = Number(((100 * winCount) / filteredBase.length).toFixed(2));

  return {
    filteredBase,
    listBase,
    winCount,
    winRate,
    fullData,
  };
};

export const getSeriesMarkPoint = ({
  buyItem,
  sellItem,
  offset = 10,
}: {
  buyItem?: BackTestSymbol;
  sellItem?: BackTestSymbol;
  offset?: number;
}) => {
  const seriesMarkPointData = [];

  if (buyItem) {
    seriesMarkPointData.push({
      name: 'Buy',
      coord: [moment(buyItem.date).format(DATE_FORMAT), buyItem.priceOpen],
      value: buyItem.priceOpen,
      itemStyle: {
        color: '#e700ff',
      },
      symbolOffset: [0, offset],
    });
  }
  if (sellItem) {
    seriesMarkPointData.push({
      name: 'Sell',
      coord: [moment(sellItem.date).format(DATE_FORMAT), sellItem.priceOpen],
      value: sellItem.priceOpen,
      itemStyle: {
        color: '#0007ff',
      },
      symbolOffset: [0, -offset],
      symbolRotate: 180,
    });
  }

  return {
    symbol: 'arrow',
    symbolSize: 10,
    label: {
      formatter: function (param: any) {
        return '';
      },
    },
    data: seriesMarkPointData,
  };
};

export const getLatestBase = (data: BackTestSymbol[]): Base | null => {
  if (!data || data.length === 0 || data.length < 6) return null;
  const buyIndex = 0;
  const startBaseIndex = 1;
  const endBaseIndex = 6;
  const list = data.slice(startBaseIndex, endBaseIndex);

  const { base_min, base_max } = getBase_min_max(list);
  if (base_min && base_max) {
    const percent = (100 * (base_max - base_min)) / base_min;
    if (percent < 14) {
      const averageVolume = meanBy(list, 'totalVolume');

      let change_buyPrice = BACKTEST_FILTER.change_buyPrice;
      let num_high_vol_than_t0 = 0;

      const change_t0_vol =
        (100 * (data[0].totalVolume - averageVolume)) / averageVolume;
      const change_t0 =
        (100 * (data[0].priceClose - list[0].priceClose)) / list[0].priceClose;

      return {
        buyIndex,
        startBaseIndex,
        endBaseIndex,
        change_t0_vol,
        change_t0,
        change_buyPrice,
        num_high_vol_than_t0,
        base_max,
        base_min,
      };
    }
  }
  return null;
};
