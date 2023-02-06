import { meanBy, cloneDeep, groupBy, chunk } from 'lodash';
import moment from 'moment';
import {
  DATE_FORMAT,
  getBase_min_max,
  getListAllSymbols,
  BACKTEST_COUNT,
  MAX_PERCENT_BASE,
} from './constants';
import { Base, SupabaseData, StockData, StockCoreData } from './types';
import StockService from './service';
import request from '@/services/request';
import { notification } from 'antd';
import config from '@/config';
import { getStockData } from './tests';

const baseUrl = config.apiUrl;

export const getDataChart = ({
  data,
  volumeField = 'totalVolume',
  grid,
  seriesMarkPoint,
  markLine,
}: {
  data: StockCoreData[];
  volumeField?: 'dealVolume' | 'totalVolume';
  grid?: any;
  seriesMarkPoint?: any;
  markLine?: any;
}) => {
  const newData = [...data];
  const dates = newData
    .map((i: StockCoreData) => moment(i.date).format(DATE_FORMAT))
    .reverse();
  const prices = newData
    .map((i: StockCoreData) => [
      i.priceOpen,
      i.priceClose,
      i.priceLow,
      i.priceHigh,
      i[volumeField],
    ])
    .reverse();
  const volumes = newData
    .reverse()
    .map((i: StockCoreData, index: number) => [
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

export const filterData = (data: StockData[], filter: Partial<StockData>) => {
  const { change_t0, estimated_vol_change } = filter;

  const result = data.filter((i: StockData) => {
    if (change_t0 && i.change_t0 < change_t0) {
      return false;
    }

    if (estimated_vol_change && i.estimated_vol_change < estimated_vol_change) {
      return false;
    }

    return true;
  });

  return result;
};

export const getSeriesMarkPoint = ({
  listMarkPoints,
  offset = 10,
}: {
  listMarkPoints?: StockCoreData[];
  offset?: number;
}) => {
  const seriesMarkPointData: any = [];

  if (listMarkPoints) {
    listMarkPoints.forEach((i: StockCoreData) => {
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

export const getLatestBase = (data: StockCoreData[]): Base | undefined => {
  if (!data || data.length === 0 || data.length < 6) return undefined;
  const startBaseIndex = 0;
  let endBaseIndex = 5;
  const list = data.slice(startBaseIndex, endBaseIndex);
  let { base_min, base_max } = getBase_min_max(list);

  if (base_min && base_max) {
    const percent = (100 * (base_max - base_min)) / base_min;

    if (percent < MAX_PERCENT_BASE) {
      const averageVolume = meanBy(list, 'totalVolume');
      let num_high_vol_than_t0 = 0;
      const change_t0_vol =
        (100 * (data[0].totalVolume - averageVolume)) / averageVolume;
      const change_t0 =
        (100 * (data[0].priceClose - list[0].priceClose)) / list[0].priceClose;
      let stop = false;

      data.forEach((i: StockCoreData, index: number) => {
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
        num_high_vol_than_t0,
        base_max,
        base_min,
        base_percent,
        startBaseDate: data[startBaseIndex]?.date,
        endBaseDate: data[endBaseIndex]?.date,
      };
    }
  }
  return undefined;
};

export const getStockDataFromSupabase = (data: SupabaseData[]): StockData[] => {
  const listObj: any = groupBy(data, 'symbol');
  const result: any = [];
  Object.keys(listObj).forEach((i: string) => {
    const item = cloneDeep(listObj[i]);
    result.push(getStockData(item));
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
  fullData: StockCoreData[];
  listMarkPoints?: StockCoreData[];
  listMarkLines?: any;
}) => {
  const grid = [
    {
      left: 20,
      right: 20,
      // top: 20,
      height: '80%',
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
  data: StockCoreData[],
  latestBase?: Base
): Base | undefined => {
  if (!latestBase) return undefined;

  const indexLastBase = data.findIndex(
    (i) => i.date === latestBase.endBaseDate
  );
  let closetUpperBase;
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
