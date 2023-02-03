import { getLatestBase, getClosestUpperBase } from './utils';
import { getEstimatedVol } from './constants';
import {
  StockData,
  StockCoreData,
  StockBasicData,
  BacktestData,
  ResultBacktestData,
} from './types';

export const getStockData = (data: StockCoreData[]): StockData | undefined => {
  const basicData = getStockBasicData(data);

  if (!basicData) return undefined;

  return {
    ...basicData,
    backtestData: getBacktestData(data),
  };
};

export const getBacktestData = (
  data: StockCoreData[]
): BacktestData | undefined => {
  if (data.length < 2) return undefined;

  // Filter list with change t0 > 2%
  const list_t0_greater_than_2_percent: ResultBacktestData[] = [];
  data.forEach((_, index: number) => {
    if (index + 1 === data.length) return;
    const basicData = getStockBasicData(data.slice(index + 1));
    if (!basicData) return;
    const { change_t0, latestBase } = basicData;
    if (change_t0 > 2 && latestBase) {
      const closetUpperBase = getClosestUpperBase(data, latestBase);
      list_t0_greater_than_2_percent.push({
        ...basicData,
        closetUpperBase,
      });
    }
  });

  // Check if at the break point have gap

  const result = list_t0_greater_than_2_percent;
  console.log('list_t0_greater_than_2_percent', result);
  return {
    result,
    fullData: data,
  };
};

export const getStockBasicData = (
  data: StockCoreData[]
): StockBasicData | null => {
  if (data.length < 2) return null;
  const last_data = data[0];
  const today_close_price = last_data.priceClose;
  const yesterday_close_price = data[1].priceClose;
  const change_t0 =
    (100 * (today_close_price - yesterday_close_price)) / yesterday_close_price;
  const averageVolume_last5 =
    data.slice(1, 6).reduce((a: number, b: any) => a + b.totalVolume, 0) / 5;
  const estimated_vol = getEstimatedVol(last_data);
  const estimated_vol_change =
    (100 * (estimated_vol - averageVolume_last5)) / averageVolume_last5;

  let t0_over_base_max;
  const latestBase = getLatestBase(data.slice(1));

  if (latestBase) {
    t0_over_base_max =
      (100 * (last_data.priceHigh - latestBase.base_max)) / latestBase.base_max;
  }

  return {
    symbol: last_data.symbol,
    date: last_data.date,
    change_t0,
    priceClose: last_data.priceClose,
    priceOpen: last_data.priceOpen,
    priceHigh: last_data.priceHigh,
    priceLow: last_data.priceLow,
    totalVolume: last_data.totalVolume,
    dealVolume: last_data.dealVolume,
    totalValue: last_data.totalValue,
    t0_over_base_max,
    estimated_vol_change,
    latestBase,
  };
};
