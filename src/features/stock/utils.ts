import { cloneDeep, groupBy, chunk, meanBy, minBy, maxBy } from 'lodash';
import moment from 'moment';
import {
  DATE_FORMAT,
  getListAllSymbols,
  BACKTEST_COUNT,
  UNIT_BILLION,
} from './constants';
import { SupabaseData, StockData, StockCoreData } from './types';
import StockService from './service';
import request from '@/services/request';
import { notification } from 'antd';
import config from '@/config';
import { getStockData } from './tests';

const baseUrl = config.apiUrl;

export const getDataChart = ({
  data,
  volumeField = 'dealVolume',
  seriesMarkPoint,
  markLine,
}: {
  data?: StockCoreData[];
  volumeField?: 'dealVolume' | 'totalVolume';
  seriesMarkPoint?: any;
  markLine?: any;
}) => {
  if (!data) return;
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
  newData.reverse();
  const volumes = newData.map((i: StockCoreData, index: number) => [
    index,
    i[volumeField],
    i.priceOpen < i.priceClose ? 1 : -1,
  ]);

  return {
    dates,
    prices,
    volumes,
    seriesMarkPoint: seriesMarkPoint ? seriesMarkPoint : null,
    markLine: markLine ? markLine : null,
  };
};

export const filterData = (
  data: StockData[],
  filter: Partial<StockData>,
  exclude: string[],
  stockBase: any
) => {
  const { change_t0 } = filter;

  const result = data.filter((i: StockData) => {
    if (exclude.includes(i.symbol)) {
      return false;
    }

    if (change_t0 && i.change_t0 < change_t0) {
      return false;
    }

    const { minTotal } = getMinTotalValue(i);
    if (minTotal && minTotal < 2) {
      return false;
    }

    return true;
  });

  const top1: StockData[] = [];
  const rest: StockData[] = [];

  result.forEach((i: StockData) => {
    const filter = stockBase.filter((j: any) => i.symbol === j.symbol);
    const { target, risk_b2, risk_b1 } = evaluateStockBase(
      filter[0],
      i.fullData
    );

    if (
      i.estimated_vol_change > 100 &&
      ((target && risk_b2 && target > risk_b2) ||
        (!risk_b2 && risk_b1 && target && target > risk_b1))
    ) {
      i.potential = true;
      top1.push(i);
    } else {
      rest.push(i);
    }
  });

  return top1.concat(rest);
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
  fullData?: StockCoreData[];
  listMarkPoints?: StockCoreData[];
  listMarkLines?: any;
}) => {
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
    seriesMarkPoint,
    markLine: {
      data: dataMarkLine,
    },
  });

  return newDataChart;
};

export const evaluateStockBase = (stockBase: any, data?: StockData[]) => {
  if (!stockBase || !stockBase.list_base || !data) {
    return {
      risk_b1: null,
      risk_b2: null,
      target: null,
      big_sell: [],
    };
  }

  let risk_b1;
  let risk_b2;
  let target;

  const base_1 = stockBase.list_base[0].value;
  const base_2 = stockBase.list_base[1].value;
  const base_3 = stockBase.list_base[2].value;

  const t0_price = data[0].priceClose;

  if (base_1 && base_2 && t0_price && t0_price >= base_1 && t0_price < base_2) {
    risk_b1 = (100 * (t0_price - base_1)) / base_1;
    target = (100 * (base_2 - t0_price)) / t0_price;
  } else if (
    base_1 &&
    base_3 &&
    base_2 &&
    t0_price &&
    t0_price >= base_2 &&
    t0_price < base_3
  ) {
    risk_b1 = (100 * (t0_price - base_1)) / base_1;
    risk_b2 = (100 * (t0_price - base_2)) / base_2;
    target = (100 * (base_3 - t0_price)) / t0_price;
  }

  const startBaseIndex = data.findIndex(
    (i: StockData) => i.date === '2023-01-06'
  );
  const endBaseIndex = data.findIndex(
    (i: StockData) => i.date === '2023-02-16'
  );

  const listData = data.slice(endBaseIndex, startBaseIndex + 1);
  const buy: any = [];
  let diff = 0;
  listData.forEach((i: StockData) => {
    if (i.priceClose > i.priceOpen) {
      buy.push(i);
      diff += i.totalVolume;
    } else {
      diff -= i.totalVolume;
    }
  });
  console.log(listData, buy, diff);
  return {
    risk_b2,
    risk_b1,
    target,
    big_sell: [],
  };
};

// rewrite this function
export const getListMarkLines = (stockBase?: any, stockData?: StockData) => {
  if (!stockBase || !stockData || !stockData.fullData) return [];
  const startDateBase = moment(stockData.fullData[120].date);
  const endDateBase = moment(stockData.date);

  const listMarkLines: any = [];

  (stockBase?.list_base || []).forEach((i: any) => {
    listMarkLines.push([
      {
        coord: [endDateBase.format(DATE_FORMAT), i.value],
      },
      {
        coord: [startDateBase.format(DATE_FORMAT), i.value],
      },
    ]);
  });

  return listMarkLines;
};

export const getTodayData = async (
  dates: [moment.Moment, moment.Moment],
  listSymbols: string[]
) => {
  let resFireant;
  if (
    dates[1].format(DATE_FORMAT) === moment().format(DATE_FORMAT) &&
    moment().hour() < 15 &&
    !localStorage.getItem('turnOffFetchTodayData')
  ) {
    const res = await StockService.getStockDataFromFireant({
      startDate: moment().format(DATE_FORMAT),
      endDate: moment().format(DATE_FORMAT),
      listSymbols,
    });
    resFireant = res.map((i) => {
      const item = i.data && i.data[0];
      if (item) {
        const {
          date,
          dealVolume,
          priceClose,
          priceHigh,
          priceLow,
          priceOpen,
          symbol,
          totalValue,
          totalVolume,
        } = item;
        return {
          date: moment(date).format(DATE_FORMAT),
          dealVolume,
          priceClose,
          priceHigh,
          priceLow,
          priceOpen,
          symbol,
          totalValue,
          totalVolume,
        };
      }
      return null;
    });
    resFireant = resFireant.filter((i) => i);
  }
  return resFireant;
};

export const getMinTotalValue = (data: StockData | undefined) => {
  let minTotal;
  let maxTotal;
  let averageTotal;

  if (data && data.fullData) {
    minTotal = minBy(data.fullData.slice(1, 20), 'totalValue')?.totalValue;
    if (minTotal) {
      minTotal = (minTotal / UNIT_BILLION).toFixed(0);
    }
    maxTotal = maxBy(data.fullData.slice(1, 20), 'totalValue')?.totalValue;
    if (maxTotal) {
      maxTotal = (maxTotal / UNIT_BILLION).toFixed(0);
    }

    averageTotal = meanBy(data.fullData.slice(1, 20), 'totalValue');
    if (averageTotal) {
      averageTotal = (averageTotal / UNIT_BILLION).toFixed(0);
    }
  }

  return {
    minTotal,
    maxTotal,
    averageTotal,
  };
};

export const getColorStock = (data: StockData | undefined) => {
  if (!data) return '';
  if (data.change_t0 > 6.5) {
    return '#ff00ff';
  } else if (data.change_t0 > 0) {
    return '#00aa00';
  } else if (data.change_t0 <= 0) {
    return '#ee5442';
  } else if (data.change_t0 < -6.5) {
    return '#00cccc';
  }
};
