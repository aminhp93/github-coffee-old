import { meanBy, cloneDeep, groupBy, chunk } from 'lodash';
import moment from 'moment';
import {
  DATE_FORMAT,
  getBase_min_max,
  getListAllSymbols,
  DEFAULT_FILTER,
  BACKTEST_COUNT,
  MAX_PERCENT_BASE,
} from './constants';
import {
  HistoricalQuote,
  BaseFilter,
  BackTestSymbol,
  Base,
  FilterBackTest,
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

export const mapDataFromSupabase = (data: SupabaseData[]) => {
  const listObj: any = groupBy(data, 'symbol');
  const result: any = [];
  Object.keys(listObj).forEach((i: string) => {
    const item = cloneDeep(listObj[i]);
    result.push(mapHistoricalQuote(item));
  });
  return result;
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
    for (const key in objData) {
      if (Object.prototype.hasOwnProperty.call(objData, key)) {
        const element = objData[key];
        objData[key] = element.map((i: any) => {
          i.key = `${i.symbol}_${i.date}`;
          i.date = moment(i.date).format(DATE_FORMAT);
          return i;
        });
        listPromiseUpdate.push(
          StockService.deleteAndInsertStockData(
            moment(key).format(DATE_FORMAT),
            element
          )
        );
      }
    }
    await Promise.all(listPromiseUpdate);
  }
  return resListPromises;
};

export const mapDataChart = ({
  fullData,
  listMarkPoints = [],
  listMarkLines = [],
}: {
  fullData: any;
  listMarkPoints?: any;
  listMarkLines?: any;
}) => {
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
        stop = true;
      }
    }
  }
  return closetUpperBase;
};
