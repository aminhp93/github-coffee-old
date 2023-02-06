import { filterData } from './utils';
import {
  DEFAULT_FILTER,
  getEstimatedVol,
  getBase_min_max,
  MAX_PERCENT_BASE,
} from './constants';
import { StockData, StockCoreData, Base } from './types';
import { min, max } from 'lodash';

export const getStockData = (data: StockCoreData[]): StockData | undefined => {
  const mappedData = mapStockData(data);
  const backtestData = getBacktestData(data);

  if (!mappedData) return undefined;

  return {
    ...mappedData,
    ...backtestData,
  };
};

export const mapStockData = (data: StockCoreData[]): StockData | undefined => {
  if (data.length < 2) return undefined;

  //  get StockCoreData
  const last_data = data[0];

  const {
    symbol,
    date,
    priceClose,
    priceOpen,
    priceHigh,
    priceLow,
    totalVolume,
    dealVolume,
    totalValue,
  } = last_data;

  // get change_t0
  const today_close_price = last_data.priceClose;
  const yesterday_close_price = data[1].priceClose;
  const change_t0 =
    (100 * (today_close_price - yesterday_close_price)) / yesterday_close_price;

  // get estimated_vol_change
  const averageVolume_last5 =
    data.slice(1, 6).reduce((a: number, b: any) => a + b.totalVolume, 0) / 5;
  const estimated_vol = getEstimatedVol(last_data);
  const estimated_vol_change =
    (100 * (estimated_vol - averageVolume_last5)) / averageVolume_last5;
  const stockData: StockData = {
    symbol,
    date,
    priceClose,
    priceOpen,
    priceHigh,
    priceLow,
    totalVolume,
    dealVolume,
    totalValue,
    change_t0,
    estimated_vol_change,
  };

  // get Extends Data

  let t0_over_base_max;
  const latestBase = getLatestBase(data.slice(1));

  if (latestBase) {
    t0_over_base_max =
      (100 * (last_data.priceHigh - latestBase.base_max)) / latestBase.base_max;
  }
  const closetUpperBase = getClosestUpperBase(data, latestBase);

  stockData.t0_over_base_max = t0_over_base_max;
  stockData.closetUpperBase = closetUpperBase;
  stockData.latestBase = latestBase;

  return stockData;
};

export const getBacktestData = (
  data: StockCoreData[]
): {
  backtestData: StockData[] | undefined;
  fullData: StockData[] | undefined;
} => {
  console.log('getBacktestData', data);
  if (data.length < 2)
    return {
      backtestData: undefined,
      fullData: undefined,
    };
  const fullData: StockData[] = [];
  data.forEach((_, index: number) => {
    const source = data.slice(index);
    const mappedSource = mapStockData(source);
    if (mappedSource) {
      fullData.push(mappedSource);
    }
  });

  const backtestData = filterData(fullData, DEFAULT_FILTER);
  console.log('backtestData', backtestData, 'fullData', fullData);
  return {
    backtestData,
    fullData,
  };
};

const getLatestBase = (data: StockCoreData[]): Base | undefined => {
  if (!data || data.length === 0 || data.length < 6) return undefined;
  const startBaseIndex = 0;
  let endBaseIndex = 5;
  const list = data.slice(startBaseIndex, endBaseIndex);
  let { base_min, base_max } = getBase_min_max(list);

  if (base_min && base_max) {
    const percent = (100 * (base_max - base_min)) / base_min;

    if (percent < MAX_PERCENT_BASE) {
      let stop = false;
      data.forEach((i: StockCoreData, index: number) => {
        if (index < 6 || stop) return;
        const new_min = min([base_min, i.priceOpen, i.priceClose]);
        const new_max = max([base_max, i.priceOpen, i.priceClose]);
        const new_percent = (100 * (new_max! - new_min!)) / new_min!;
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
        base_max,
        base_min,
        base_percent,
        base_length: endBaseIndex - startBaseIndex + 1,
        startBaseDate: data[startBaseIndex]?.date,
        endBaseDate: data[endBaseIndex]?.date,
      };
    }
  }
  return undefined;
};

const getClosestUpperBase = (
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
