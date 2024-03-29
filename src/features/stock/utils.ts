/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import { cloneDeep, groupBy, max, maxBy, meanBy, min, minBy } from 'lodash';
import { DATE_FORMAT, UNIT_BILLION } from './constants';
import StockService from './service';
import { getStockData } from './tests';
import {
  StockChartData,
  StockCoreData,
  StockData,
  SupabaseData,
} from './Stock.types';

export const filterData = (stockData: StockData[]): StockData[] => {
  const top1: StockData[] = [];
  const rest: StockData[] = [];

  stockData.forEach((i: StockData) => {
    if (i.potential) {
      top1.push(i);
    } else {
      rest.push(i);
    }
  });

  // rest.sort((a: StockData, b: StockData) => a.target && b.target && b.target - a.target);
  // sort rest by target
  rest.sort((a: StockData, b: StockData) => {
    if (a.target && b.target) {
      return b.target - a.target;
    } else if (a.target && !b.target) {
      return -1;
    } else if (!a.target && b.target) {
      return 1;
    } else {
      return 0;
    }
  });

  return top1.concat(rest);
};

export const mapNewAllStocks = ({
  stockData,
  stockBase,
}: {
  stockData: StockData[];
  stockBase: any;
}): StockData[] => {
  return stockData.map((i: StockData) => {
    const filter = stockBase.filter((j: any) => i.symbol === j.symbol);
    const { target, risk } = evaluateStockBase(filter[0], i.fullData);

    i.target = target;
    i.risk = risk;
    return i;
  });
};

const getMarkLine = (listMarkLines: any) => {
  const data: any = [];

  listMarkLines.forEach((i: any) => {
    data.push([
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
  return {
    data,
  };
};

export const getListMarkPoints = (stockBase: any, stockData: any) => {
  return stockData?.fullData?.filter(
    (item: any) => item.date === stockBase.buy_point?.date
  );
};

const getSeriesMarkPoint = ({
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
        coord: [dayjs(i.date).format(DATE_FORMAT), i.priceOpen],
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

export const updateDataWithDate = async (
  startDate: string,
  endDate: string,
  offset: number,
  listSymbols: string[]
) => {
  // get data
  const listPromises: any = [];
  listSymbols.forEach((symbol: string) => {
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
      if (Object.hasOwn(objData, key)) {
        const element = objData[key];
        objData[key] = element.map((i: any) => {
          i.key = `${i.symbol}_${i.date}`;
          i.date = dayjs(i.date).format(DATE_FORMAT);
          return i;
        });
        listPromiseUpdate.push(
          StockService.deleteAndInsertStockData(
            dayjs(key).format(DATE_FORMAT),
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
  volumeField = 'totalVolume',
}: {
  fullData?: StockCoreData[];
  listMarkPoints?: StockCoreData[];
  listMarkLines?: any;
  volumeField?: 'dealVolume' | 'totalVolume';
}): StockChartData | undefined => {
  const seriesMarkPoint = getSeriesMarkPoint({
    listMarkPoints,
    offset: 20,
  });
  const markLine = getMarkLine(listMarkLines);

  if (!fullData) return;

  const newData = [...fullData];
  newData.reverse();

  const dates = newData.map((i: StockCoreData) =>
    dayjs(i.date).format(DATE_FORMAT)
  );

  const prices = newData.map((i: StockCoreData) => [
    i.priceOpen / (i.adjRatio || 1),
    i.priceClose / (i.adjRatio || 1),
    i.priceLow / (i.adjRatio || 1),
    i.priceHigh / (i.adjRatio || 1),
    i[volumeField],
  ]);

  const volumes = newData.map((i: StockCoreData, index: number) => [
    index,
    i[volumeField],
    i.priceOpen < i.priceClose ? 1 : -1,
  ]);

  return {
    dates,
    prices,
    volumes,
    seriesMarkPoint,
    markLine,
  };
};

export const evaluateStockBase = (stockBase: any, data?: StockData[]) => {
  if (!stockBase?.list_base || !data) {
    return {
      risk_b1: undefined,
      risk_b2: undefined,
      target: undefined,
      big_sell: [],
    };
  }

  let risk;
  let target;

  const base_1 = stockBase.list_base[0].value;
  const base_2 = stockBase.list_base[1].value;

  const t0_price = data[0].priceClose;

  if (base_1) {
    risk = (100 * (t0_price - base_1)) / base_1;
  }

  if (base_2) {
    target = (100 * (base_2 - t0_price)) / t0_price;
  }

  const startIndex = data.findIndex(
    (i: StockData) => i.date === stockBase.buy_point?.date
  );

  const listData = data.slice(0, startIndex + 1);
  const list_50 = data.slice(startIndex + 1, startIndex + 51);
  const average_50 = meanBy(list_50, 'totalVolume');

  listData.filter((i: StockData) => i.totalVolume > average_50 * 1.2);

  return {
    risk,
    target,
    big_sell: [],
  };
};

// rewrite this function
export const getListMarkLines = (stockBase?: any, stockData?: StockData) => {
  if (!stockBase || !stockData || !stockData.fullData) return [];
  const startPoint =
    stockData.fullData.length > 120 ? 120 : stockData.fullData.length - 1;
  const startDateBase = dayjs(stockData.fullData[startPoint].date);
  const endDateBase = dayjs(stockData.date);

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
  date: dayjs.Dayjs,
  listSymbols: string[]
) => {
  let resFireant;
  if (
    date.format(DATE_FORMAT) === dayjs().format(DATE_FORMAT) &&
    dayjs().hour() < 15 &&
    !localStorage.getItem('turnOffFetchTodayData')
  ) {
    const testSampleData = await StockService.getHistoricalQuotes({
      symbol: 'VPB',
      startDate: dayjs().format(DATE_FORMAT),
      endDate: dayjs().format(DATE_FORMAT),
      offset: 0,
    });

    if (!testSampleData?.length) return [];

    const res = await StockService.getStockDataFromFireant({
      startDate: dayjs().format(DATE_FORMAT),
      endDate: dayjs().format(DATE_FORMAT),
      listSymbols,
    });
    resFireant = res.map((i) => {
      const item = i?.data[0];
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
          date: dayjs(date).format(DATE_FORMAT),
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

export const getMinTotalValue = (
  data: StockData | undefined
): {
  minTotal: number | undefined;
  maxTotal: number | undefined;
  averageTotal: number | undefined;
} => {
  let minTotal;
  let maxTotal;
  let averageTotal;

  if (data?.fullData) {
    minTotal = minBy(data.fullData.slice(1, 20), 'totalValue')?.totalValue;
    if (minTotal) {
      minTotal = Number((minTotal / UNIT_BILLION).toFixed(0));
    }
    maxTotal = maxBy(data.fullData.slice(1, 20), 'totalValue')?.totalValue;
    if (maxTotal) {
      maxTotal = Number((maxTotal / UNIT_BILLION).toFixed(0));
    }

    averageTotal = meanBy(data.fullData.slice(1, 20), 'totalValue');
    if (averageTotal) {
      averageTotal = Number((averageTotal / UNIT_BILLION).toFixed(0));
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

export const getEstimatedVol = (data: StockCoreData) => {
  if (data.date === dayjs().format(DATE_FORMAT)) {
    // from 9:00 to 11:30
    const morning_time = 60 * 2.5;

    // from 13:00 to 14:45
    const afternoon_time = 60 * 1.75;

    const total_time = morning_time + afternoon_time;
    const current_time = dayjs().format('HH:mm');
    let estimated_vol;

    if (current_time < '09:00') {
      estimated_vol = 0;
    } else if (current_time >= '09:00' && current_time <= '11:30') {
      const diff_time = dayjs(current_time, 'HH:mm').diff(
        dayjs('09:00', 'HH:mm'),
        'minute'
      );
      estimated_vol = data.totalVolume * (total_time / diff_time);
    } else if (current_time >= '11:31' && current_time <= '12:59') {
      estimated_vol = data.totalVolume * (total_time / morning_time);
    } else if (current_time >= '13:00' && current_time <= '14:45') {
      const diff_time = dayjs(current_time, 'HH:mm').diff(
        dayjs('13:00', 'HH:mm'),
        'minute'
      );
      estimated_vol =
        data.totalVolume * (total_time / (morning_time + diff_time));
    } else {
      estimated_vol = data.totalVolume;
    }
    return estimated_vol;
  }

  return data.totalVolume;
};

export const getBase_min_max = (data: StockCoreData[]) => {
  return {
    base_min: min([
      minBy(data, 'priceOpen')?.priceOpen,
      minBy(data, 'priceClose')?.priceClose,
    ]),
    base_max: max([
      maxBy(data, 'priceOpen')?.priceOpen,
      maxBy(data, 'priceClose')?.priceClose,
    ]),
  };
};

export const getMaxPercentBase = (symbol: string) => {
  if (['MBS'].includes(symbol)) {
    return 10;
  } else if (['BSR'].includes(symbol)) {
    return 15;
  } else {
    return 7;
  }
};

export const checkValidCondition = (
  item1: any,
  item2: any,
  listFields: any
) => {
  let result: boolean[] = [];
  listFields.forEach((i: any) => {
    if (item1[i].toFixed(2) === item2[i].toFixed(2)) {
      result.push(true);
    } else {
      result.push(false);
    }
  });
  const listInvalid = result.filter((i) => !i);
  return listInvalid.length === 0;
};

export const analyse = (stockData: any, stockBase: any) => {
  // get full data as fullData
  const fullData = stockData?.fullData || [];

  // get buy_point
  const buyPoint = stockBase?.buy_point?.date;

  // filter data from buy_point
  const filterData = fullData.filter((i: any) => i.date >= buyPoint);

  const indexOfBuyPoint = fullData.findIndex((i: any) => i.date === buyPoint);
  const listAverage = fullData.slice(indexOfBuyPoint, indexOfBuyPoint + 20);

  const average_vol = meanBy(listAverage, 'totalVolume');

  // 1. list all day with %change < -2% and volumn change ? avergate 2 weeks
  const listBigSell = filterData.filter(
    (i: any) => i.change_t0 < -2 && i.totalVolume > average_vol
  );

  // 2. Count all buy and sell volume
  let countVolume = 0;
  filterData.forEach((i: any) => {
    if (i.change_t0 < 0) {
      countVolume -= i.totalVolume;
    } else {
      countVolume += i.totalVolume;
    }
  });
  return {
    listBigSell,
    countEstimate: (countVolume / average_vol).toFixed(1),
  };
};
