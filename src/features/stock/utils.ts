import { meanBy, cloneDeep, groupBy } from 'lodash';
import moment from 'moment';
import {
  DATE_FORMAT,
  UNIT_BILLION,
  BACKTEST_FILTER,
  getAction,
  getEstimatedVol,
  getBase_min_max,
  getListAllSymbols,
  DEFAULT_FILTER,
} from './constants';
import {
  HistoricalQuote,
  ExtraData,
  CustomSymbol,
  Filter,
  BackTestSymbol,
  Base,
  FilterBackTest,
  BackTest,
  SimplifiedBackTestSymbol,
} from './types';
import StockService from './service';

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
    (100 * (last_data.totalVolume - last_data.dealVolume)) /
    (last_data.dealVolume || 1);

  const action = getAction({
    changePrice,
    latestBase,
    estimated_vol_change,
    extraData,
  });

  const last20HistoricalQuote: BackTestSymbol[] = data.map(
    (i: HistoricalQuote) => {
      return {
        date: i.date.replace('T00:00:00', ''),
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
  let nextIndex: number = 1;

  data.forEach((_: BackTestSymbol, index: number) => {
    if (index !== nextIndex) return;
    nextIndex = index + 1;
    const startBaseIndex = index;
    let endBaseIndex = index + 5;
    const list = data.slice(startBaseIndex, endBaseIndex);
    let { base_min, base_max } = getBase_min_max(list);
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
      const change_buyPrice = DEFAULT_FILTER.changePrice_min;
      const num_high_vol_than_t0 = list.filter(
        (i: BackTestSymbol) => i.totalVolume > data[buyIndex!].totalVolume
      ).length;
      let change_t3 = null;

      if (data[index - 4]) {
        const t3Price = data[index - 4].priceClose;
        const buyPrice =
          data[buyIndex].priceClose *
          (1 + DEFAULT_FILTER.changePrice_min / 100);

        change_t3 = (100 * (t3Price - buyPrice)) / buyPrice;
      }

      let stop = false;

      data.slice(endBaseIndex).forEach((m: BackTestSymbol) => {
        if (stop) return;
        const new_min = base_min! > m.priceClose ? m.priceClose : base_min!;
        const new_max = base_max! < m.priceClose ? m.priceClose : base_max!;
        const new_percent = (100 * (new_max - new_min)) / new_min;
        if (new_percent < 14) {
          list.push(m);
          endBaseIndex = endBaseIndex + 1;
          base_min = new_min;
          base_max = new_max;
        } else {
          stop = true;
        }
      });

      const base_percent = (100 * (base_max - base_min)) / base_min;
      const t0_over_base_max =
        (100 * (data[buyIndex].priceClose - base_max)) / base_max;

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
        base_percent,
        t0_over_base_max,
      });
      nextIndex = nextIndex + endBaseIndex - startBaseIndex - 1;
    }
  });

  listBase = listBase.map((i: Base, index: number) => {
    let closestUpperBaseIndex;
    let closestLowerBaseIndex;

    let stop1 = false;
    for (let j = index + 1; j < listBase.length; j++) {
      if (!stop1) {
        if (listBase[j].base_min > i.base_min) {
          closestUpperBaseIndex = j;
          stop1 = true;
        }
      }
    }

    let stop2 = false;
    for (let k = index + 1; k < listBase.length; k++) {
      if (!stop2) {
        if (listBase[k].base_max < i.base_max) {
          closestLowerBaseIndex = k;
          stop2 = true;
        }
      }
    }

    if (closestUpperBaseIndex) {
      i.closestUpperBaseIndex = closestUpperBaseIndex;
      i.upperPercent =
        (100 * (listBase[closestUpperBaseIndex].base_min - i.base_max)) /
        i.base_max;
    }

    if (closestLowerBaseIndex) {
      i.closestLowerBaseIndex = closestLowerBaseIndex;
      i.lowerPercent =
        (100 * (i.base_min - listBase[closestLowerBaseIndex].base_max)) /
        listBase[closestLowerBaseIndex].base_max;
    }

    return i;
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

    // replace first item by latest data
    if (
      filterRes[0].date ===
        dataSource.find((j) => j.symbol === i.symbol)!.last20HistoricalQuote[0]
          .date ||
      filterRes[0].date >
        dataSource.find((j) => j.symbol === i.symbol)!.last20HistoricalQuote[0]
          .date
    ) {
      //  do nothing
    } else {
      filterRes.unshift(
        dataSource.find((j) => j.symbol === i.symbol)!.last20HistoricalQuote[0]
      );
    }

    if (filterRes.length) {
      const listBase = getListBase(filterRes);
      newItem.backtest = getBackTest(filterRes, listBase, BACKTEST_FILTER);
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
  const filteredBase = listBase.filter((j: Base) => {
    if (
      (filterCondition.change_t0 || filterCondition.change_t0 === 0) &&
      j.change_t0 < filterCondition.change_t0
    ) {
      return false;
    }
    if (
      (filterCondition.change_t0_vol || filterCondition.change_t0_vol === 0) &&
      j.change_t0_vol < filterCondition.change_t0_vol
    ) {
      return false;
    }
    if (
      (filterCondition.num_high_vol_than_t0 ||
        filterCondition.num_high_vol_than_t0 === 0) &&
      j.num_high_vol_than_t0 < filterCondition.num_high_vol_than_t0
    ) {
      return false;
    }

    if (
      (filterCondition.t0_over_base_max ||
        filterCondition.t0_over_base_max === 0) &&
      j.t0_over_base_max < filterCondition.t0_over_base_max
    ) {
      return false;
    }

    return true;
  });
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
  let endBaseIndex = 6;
  const list = data.slice(startBaseIndex, endBaseIndex);
  let { base_min, base_max } = getBase_min_max(list);

  if (base_min && base_max) {
    const percent = (100 * (base_max - base_min)) / base_min;

    if (percent < 14) {
      const averageVolume = meanBy(list, 'totalVolume');
      let change_buyPrice = DEFAULT_FILTER.changePrice_min;
      let num_high_vol_than_t0 = 0;
      const change_t0_vol =
        (100 * (data[0].totalVolume - averageVolume)) / averageVolume;
      const change_t0 =
        (100 * (data[0].priceClose - list[0].priceClose)) / list[0].priceClose;
      let stop = false;

      data.forEach((i: BackTestSymbol, index: number) => {
        if (index < 6 || stop) return;
        const new_min = base_min! > i.priceClose ? i.priceClose : base_min!;
        const new_max = base_max! < i.priceClose ? i.priceClose : base_max!;
        const new_percent = (100 * (new_max - new_min)) / new_min;
        if (new_percent < 14) {
          list.push(i);
          endBaseIndex = index;
          base_min = new_min;
          base_max = new_max;
        } else {
          stop = true;
        }
      });

      const base_percent = (100 * (base_max - base_min)) / base_min;
      const t0_over_base_max =
        (100 * (data[buyIndex].priceClose - base_max)) / base_max;

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
        base_percent,
        t0_over_base_max,
      };
    }
  }
  return null;
};

export const mapDataChart = (backTestData: BackTest | null, record: Base) => {
  if ((record.buyIndex !== 0 && !record.buyIndex) || !backTestData) return;

  const list = backTestData.fullData.slice(
    record.buyIndex > 9 ? record.buyIndex - 10 : record.buyIndex,
    record.buyIndex + 90
  );

  const buyItem = { ...backTestData.fullData[record.buyIndex] };
  const sellItem = { ...backTestData.fullData[record.buyIndex - 3] };
  const grid = [
    {
      left: 20,
      right: 20,
      top: 20,
      height: '70%',
    },
    {
      left: 20,
      right: 20,
      height: '20%',
      bottom: 0,
    },
  ];

  const seriesMarkPoint = getSeriesMarkPoint({
    buyItem,
    sellItem,
    offset: 20,
  });

  const dataMarkLine: any = [];

  const filterBase = [record];
  if (record.closestUpperBaseIndex) {
    filterBase.push(backTestData.listBase[record.closestUpperBaseIndex]);
  }
  if (record.closestLowerBaseIndex) {
    filterBase.push(backTestData.listBase[record.closestLowerBaseIndex]);
  }

  filterBase.forEach((baseItem: Base, index) => {
    const baseStartData = {
      ...backTestData.fullData[baseItem.startBaseIndex],
    };
    const baseEndData = {
      ...backTestData.fullData[baseItem.endBaseIndex],
    };

    dataMarkLine.push([
      {
        name: '',
        symbol: 'none',
        lineStyle: {
          color: 'purple',
        },
        coord: [
          moment(baseStartData.date).format(DATE_FORMAT),
          baseItem.base_min,
        ],
      },
      {
        coord: [
          moment(baseEndData.date).format(DATE_FORMAT),
          baseItem.base_min,
        ],
      },
    ]);
    dataMarkLine.push([
      {
        name: '',
        symbol: 'none',
        lineStyle: {
          color: 'purple',
        },
        coord: [
          moment(baseStartData.date).format(DATE_FORMAT),
          baseItem.base_max,
        ],
      },
      {
        coord: [
          moment(baseEndData.date).format(DATE_FORMAT),
          baseItem.base_max,
        ],
      },
    ]);
  });

  const newDataChart = getDataChart({
    data: list,
    grid,
    seriesMarkPoint,
    markLine: {
      data: dataMarkLine,
    },
  });

  return newDataChart;
};

export const getDataFromSupabase = async ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  const res = await StockService.getStockDataFromSupabase({
    startDate,
    endDate,
  });

  const listObj: any = groupBy(res.data, 'symbol');
  const result: any = [];
  Object.keys(listObj).forEach((i: string) => {
    result.push(
      mapHistoricalQuote(listObj[i], {
        key: i,
        symbol: i,
      })
    );
  });
  console.log('getDataFromSupabase', result);
  return result;
};

export const getDataFromFireant = async ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  const listPromises: any = [];

  getListAllSymbols().forEach((j: string) => {
    listPromises.push(
      StockService.getHistoricalQuotes(
        { symbol: j, startDate, endDate },
        mapHistoricalQuote,
        {
          key: j,
          symbol: j,
        }
      )
    );
  });

  const res = await Promise.all(listPromises);
  console.log('getDataFromFireant', res);
  return res;
};

export const getBackTestDataOffline = async ({
  database,
  dataSource,
  fullDataSource,
  filters = DEFAULT_FILTER,
}: {
  database: 'supabase' | 'heroku';
  dataSource: CustomSymbol[];
  fullDataSource: CustomSymbol[];
  filters?: Filter;
}) => {
  const symbols = dataSource
    .filter(
      (i: CustomSymbol) =>
        i.buySellSignals.action === 'buy' || i.buySellSignals.action === 'sell'
    )
    .map((i: CustomSymbol) => i.symbol);

  const res = await StockService.getBackTestData({ symbols, database });

  let mappedData: any;

  if (database === 'heroku') {
    mappedData = res.data.map((i: SimplifiedBackTestSymbol) => {
      return {
        date: i.d,
        dealVolume: i.v,
        priceClose: i.c,
        priceHigh: i.h,
        priceLow: i.l,
        priceOpen: i.o,
        totalVolume: i.v2,
        symbol: i.s,
      };
    });
  } else {
    mappedData = res.data;
  }

  const newFullDataSource = getMapBackTestData(
    mappedData,
    dataSource,
    fullDataSource
  );
  const newData = getDataSource(newFullDataSource, filters);

  return {
    fullDataSource: newFullDataSource,
    dataSource: newData,
  };
};
