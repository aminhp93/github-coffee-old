import { getLatestBase, getClosestUpperBase, filterData } from './utils';
import { DEFAULT_FILTER, getEstimatedVol } from './constants';
import { StockData, StockCoreData } from './types';

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
