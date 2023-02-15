import { cloneDeep, groupBy, chunk, meanBy } from 'lodash';
import moment from 'moment';
import { DATE_FORMAT, getListAllSymbols, BACKTEST_COUNT } from './constants';
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
  const volumes = newData
    .reverse()
    .map((i: StockCoreData, index: number) => [
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

export const filterData = (data: StockData[], filter: Partial<StockData>) => {
  const {
    change_t0,
    // estimated_vol_change, t0_over_base_max
  } = filter;

  const result = data.filter((i: StockData) => {
    // if (!i.latestBase) {
    //   return false;
    // }

    if (change_t0 && i.change_t0 < change_t0) {
      return false;
    }

    // if (estimated_vol_change && i.estimated_vol_change < estimated_vol_change) {
    //   return false;
    // }

    // if (
    //   t0_over_base_max &&
    //   i.t0_over_base_max &&
    //   i.t0_over_base_max < t0_over_base_max
    // ) {
    //   return false;
    // }

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
      risk: null,
      target: null,
      big_sell: [],
    };
  }

  const base_1 = stockBase.list_base[0].value;
  const base_2 = stockBase.list_base[1].value;
  const base_3 = stockBase.list_base[2].value;

  const risk = base_2 && base_1 && (100 * (base_2 - base_1)) / base_1;
  const target = base_2 && base_3 && (100 * (base_3 - base_2)) / base_2;

  const startBaseIndex = data.findIndex((i: StockData) => i.date === '');

  const endBaseIndex = data.findIndex((i: StockData) => i.date === '');

  const listData = data.slice(endBaseIndex, startBaseIndex + 1);
  const averageVolume = meanBy(listData, 'totalVolume');
  const big_sell = listData
    .filter((i) => i.priceClose < i.priceOpen && i.totalVolume > averageVolume)
    .map((i) => {
      return {
        date: i.date,
        overAverage: (100 * i.totalVolume) / averageVolume,
      };
    });
  return {
    risk,
    target,
    big_sell,
  };
};

// rewrite this function
export const getListMarkLines = (stockBase?: any, stockData?: StockData) => {
  if (!stockBase || !stockData) return [];
  const startDateBase = moment(stockData.date).add(-8, 'months');
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
