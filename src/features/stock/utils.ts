import { meanBy, cloneDeep, groupBy, chunk } from 'lodash';
import moment from 'moment';
import {
  DATE_FORMAT,
  BACKTEST_FILTER,
  getBase_min_max,
  getListAllSymbols,
  DEFAULT_FILTER,
  BACKTEST_COUNT,
  MAX_PERCENT_BASE,
} from './constants';
import {
  HistoricalQuote,
  CustomSymbol,
  BaseFilter,
  BackTestSymbol,
  Base,
  FilterBackTest,
  BackTest,
  SimplifiedBackTestSymbol,
  SupabaseData,
  StockData,
} from './types';
import StockService from './service';
import request from '@/services/request';
import { notification } from 'antd';
import config from '@/config';
import { getBacktestData, getBasicData } from './tests';

const baseUrl = config.apiUrl;

export const mapHistoricalQuote = (data: HistoricalQuote[]): any => {
  const basicData = getBasicData(data);

  return {
    ...basicData,
    backtestData: getBacktestData(data),
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
    if (percent < MAX_PERCENT_BASE) {
      let buyIndex = index - 1;
      const averageVolume = meanBy(list, 'totalVolume');
      const change_t0_vol =
        (100 * (data[buyIndex].totalVolume - averageVolume)) / averageVolume;
      const change_t0 =
        (100 * (data[buyIndex].priceClose - list[0].priceClose)) /
        list[0].priceClose;
      const change_buyPrice = DEFAULT_FILTER.changePrice_min;

      let change_t3 = null;
      const buyPrice =
        data[buyIndex].priceOpen * (1 + DEFAULT_FILTER.changePrice_min / 100);
      if (data[index - 4]) {
        const t3Price = data[index - 4].priceClose;

        change_t3 = (100 * (t3Price - buyPrice)) / buyPrice;
      }

      let stop = false;

      data.slice(endBaseIndex).forEach((m: BackTestSymbol) => {
        if (stop) return;
        const new_min = base_min! > m.priceLow ? m.priceLow : base_min!;
        const new_max = base_max! < m.priceHigh ? m.priceHigh : base_max!;
        const new_percent = (100 * (new_max - new_min)) / new_min;
        if (new_percent < MAX_PERCENT_BASE) {
          list.push(m);
          endBaseIndex = endBaseIndex + 1;
          base_min = new_min;
          base_max = new_max;
        } else {
          stop = true;
        }
      });

      let max_in_20_days_without_break_base = buyPrice;
      let min_in_20_days_without_break_base = buyPrice;
      let max_in_20_days_without_break_base_index = 1;
      let min_in_20_days_without_break_base_index = 1;
      let stop_max = false;
      let stop_min = false;

      for (let i = 1; i < 20; i++) {
        const nextDay = data[buyIndex - i];
        if (nextDay) {
          // find the max value in the next 20 days
          if (nextDay.priceLow < base_min) {
            stop_max = true;
            stop_min = true;
          }
          if (!stop_max) {
            if (nextDay.priceHigh > max_in_20_days_without_break_base) {
              max_in_20_days_without_break_base = nextDay.priceHigh;
              max_in_20_days_without_break_base_index = i;
            }
          }
          if (!stop_min) {
            if (nextDay.priceLow < min_in_20_days_without_break_base) {
              min_in_20_days_without_break_base = nextDay.priceLow;
              min_in_20_days_without_break_base_index = i;
            }
          }
        }
      }

      const max_change_in_20_days =
        (100 * (max_in_20_days_without_break_base - buyPrice)) / buyPrice;

      const min_change_in_20_days =
        (100 * (min_in_20_days_without_break_base - buyPrice)) / buyPrice;

      const num_high_vol_than_t0 = list.filter(
        (i: BackTestSymbol) => i.totalVolume > data[buyIndex].totalVolume
      ).length;
      const base_percent = (100 * (base_max - base_min)) / base_min;

      listBase.push({
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
        max_change_in_20_days,
        min_change_in_20_days,
        max_in_20_days_without_break_base_index,
        min_in_20_days_without_break_base_index,
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

export const filterData = (data: StockData[], filter: BaseFilter) => {
  const { changePrice_min, estimated_vol_change_min } = filter;

  const result = data.filter((i: StockData) => {
    if (i.change_t0 < changePrice_min) {
      return false;
    }

    if (
      estimated_vol_change_min &&
      i.estimated_vol_change < estimated_vol_change_min
    ) {
      return false;
    }

    return true;
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
    // if (
    //   (filterCondition.num_high_vol_than_t0 ||
    //     filterCondition.num_high_vol_than_t0 === 0) &&
    //   j.num_high_vol_than_t0 < filterCondition.num_high_vol_than_t0
    // ) {
    //   return false;
    // }

    // if (
    //   (filterCondition.t0_over_base_max ||
    //     filterCondition.t0_over_base_max === 0) &&
    //   j.t0_over_base_max < filterCondition.t0_over_base_max
    // ) {
    //   return false;
    // }

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
  listMarkPoints,
  offset = 10,
}: {
  buyItem?: BackTestSymbol;
  sellItem?: BackTestSymbol;
  listMarkPoints?: BackTestSymbol[];
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

  if (listMarkPoints) {
    listMarkPoints.forEach((i: BackTestSymbol) => {
      seriesMarkPointData.push({
        name: 'Buy',
        coord: [moment(i.date).format(DATE_FORMAT), i.priceOpen],
        value: i.priceOpen,
        itemStyle: {
          color: '#e700ff',
        },
        symbolOffset: [0, offset],
      });
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
  const startBaseIndex = 0;
  let endBaseIndex = 5;
  const list = data.slice(startBaseIndex, endBaseIndex);
  let { base_min, base_max } = getBase_min_max(list);

  if (base_min && base_max) {
    const percent = (100 * (base_max - base_min)) / base_min;

    if (percent < MAX_PERCENT_BASE) {
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
        const new_min = base_min! > i.priceLow ? i.priceLow : base_min!;
        const new_max = base_max! < i.priceHigh ? i.priceHigh : base_max!;
        const new_percent = (100 * (new_max - new_min)) / new_min;
        if (new_percent < MAX_PERCENT_BASE) {
          list.push(i);
          endBaseIndex = index;
          base_min = new_min;
          base_max = new_max;
        } else {
          stop = true;
        }
      });

      const base_percent = (100 * (base_max - base_min)) / base_min;

      return {
        startBaseIndex,
        endBaseIndex,
        change_t0_vol,
        change_t0,
        change_buyPrice,
        num_high_vol_than_t0,
        base_max,
        base_min,
        base_percent,
        startBaseDate: data[startBaseIndex]?.date,
        endBaseDate: data[endBaseIndex]?.date,
      };
    }
  }
  return null;
};

export const mapDataChart = (backTestData: BackTest | null, record: Base) => {
  if ((record.startBaseIndex !== 0 && !record.startBaseIndex) || !backTestData)
    return;

  const list = backTestData.fullData.slice(
    record.startBaseIndex > 20
      ? record.startBaseIndex - 20
      : record.startBaseIndex,
    record.startBaseIndex + 112
  );

  const buyItem = { ...backTestData.fullData[record.startBaseIndex] };
  const sellItem = { ...backTestData.fullData[record.startBaseIndex - 3] };
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

export const mapDataFromSupabase = (data: SupabaseData[]) => {
  const listObj: any = groupBy(data, 'symbol');
  console.log('listObj', listObj);
  const result: any = [];
  Object.keys(listObj).forEach((i: string) => {
    const item = cloneDeep(listObj[i]);
    result.push(mapHistoricalQuote(item));
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
  filters?: BaseFilter;
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
  const newData = filterData(newFullDataSource as any, filters);

  return {
    fullDataSource: newFullDataSource,
    dataSource: newData,
  };
};

export const deleteAndInsertStockData = (date: string, data: any) => {
  console.log(date, data);
  // return a promise

  return new Promise(async (resolve, reject) => {
    try {
      console.log('deleteAndInsertStockData', date);
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
};

const getListPromise = async (data: any) => {
  const startDate = moment().add(-1000, 'days').format(DATE_FORMAT);
  const endDate = moment().format(DATE_FORMAT);
  const listPromise: any = [];
  data.forEach((i: any) => {
    listPromise.push(
      StockService.getHistoricalQuotes({
        symbol: i.symbol,
        startDate,
        endDate,
        offset: i.offset * 20,
        returnRequest: true,
      })
    );
  });

  return Promise.all(listPromise);
};

export const createBackTestData = async () => {
  // Get data to backtest within 1 year from buy, sell symbol
  const listPromises: any = [];
  getListAllSymbols().forEach((j: any) => {
    for (let i = 0; i <= BACKTEST_COUNT; i++) {
      listPromises.push({
        symbol: j,
        offset: i,
      });
    }
  });

  const chunkedPromise = chunk(listPromises, 200);
  console.log(chunkedPromise);

  await request({
    url: `${baseUrl}/api/stocks/delete/`,
    method: 'POST',
  });

  for (let i = 0; i < chunkedPromise.length; i++) {
    // delay 2s
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await getListPromise(chunkedPromise[i]);
    const mappedRes = res
      .map((i: any) => i.data)
      .flat()
      .map((i: any) => {
        i.key = `${i.symbol}_${i.date}`;
        i.date = moment(i.date).format(DATE_FORMAT);
        return i;
      });
    // const res2 = await request({
    //   url: `${baseUrl}/api/stocks/delete/`,
    //   method: 'POST',
    // });
    const res2 = await request({
      url: `${baseUrl}/api/stocks/create/`,
      method: 'POST',
      data: mappedRes,
      // data: datafail,
    });
    console.log(i, chunkedPromise.length, mappedRes);

    if (res2?.status !== 200) {
      notification.error({ message: 'error' });
      // break for loop
      return;
    }
  }

  notification.success({ message: 'success' });
};

export const updateDataWithDate = async (
  startDate: string,
  endDate: string,
  offset: number
) => {
  // get data
  const listPromises: any = [];
  getListAllSymbols().forEach((symbol: string) => {
    listPromises.push(
      StockService.getHistoricalQuotes({
        symbol,
        startDate,
        endDate,
        offset,
      })
    );
  });

  const resListPromises = await Promise.all(listPromises);
  if (resListPromises) {
    let listPromiseUpdate: any = [];
    const flattenData = resListPromises.flat();
    const objData: any = groupBy(flattenData, 'date');
    console.log('objData', objData);
    for (const key in objData) {
      if (Object.prototype.hasOwnProperty.call(objData, key)) {
        const element = objData[key];
        objData[key] = element.map((i: any) => {
          i.key = `${i.symbol}_${i.date}`;
          i.date = moment(i.date).format(DATE_FORMAT);
          return i;
        });
        console.log(261, key);
        listPromiseUpdate.push(
          deleteAndInsertStockData(moment(key).format(DATE_FORMAT), element)
        );
      }
    }
    const res2 = await Promise.all(listPromiseUpdate);
    console.log(res2);
    // setListUpdateStatus(res2);
    // setColumns(UPDATE_STATUS_COLUMNS);
  }
  return resListPromises;
};

export const mapDataChart2 = ({
  fullData,
  listMarkPoints = [],
  listMarkLines = [],
}: {
  fullData: any;
  listMarkPoints?: any;
  listMarkLines?: any;
}) => {
  console.log('mapDataChart2', fullData);

  const grid = [
    {
      left: 20,
      right: 20,
      // top: 20,
      height: '90%',
    },
    {
      left: 20,
      right: 20,
      height: '10%',
      bottom: 0,
    },
  ];

  const seriesMarkPoint = getSeriesMarkPoint({
    listMarkPoints,
    offset: 20,
  });

  const dataMarkLine: any = [];

  listMarkLines.forEach((i: any) => {
    dataMarkLine.push([
      {
        name: '',
        symbol: 'none',
        lineStyle: {
          color: 'purple',
        },
        coord: i[0].coord,
      },
      {
        coord: i[1].coord,
      },
    ]);
  });

  const newDataChart = getDataChart({
    data: fullData,
    grid,
    seriesMarkPoint,
    markLine: {
      data: dataMarkLine,
    },
  });

  console.log(newDataChart, 'newDataChart');

  return newDataChart;
};

export const getClosestUpperBase = (
  data: BackTestSymbol[],
  latestBase: Base
): Base | null => {
  const indexLastBase = data.findIndex(
    (i) => i.date === latestBase.endBaseDate
  );
  let closetUpperBase = null;
  let stop = false;

  for (let i = indexLastBase; i < data.length; i++) {
    if (stop) break;
    const item = data[i];

    // check if first point greater than base_max
    if (item.priceHigh > latestBase.base_max) {
      closetUpperBase = getLatestBase(data.slice(i));
      if (closetUpperBase) {
        console.log('closetUpperBase', closetUpperBase, item);
        stop = true;
      }
    }
  }
  return closetUpperBase;
};
