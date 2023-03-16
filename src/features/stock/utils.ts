import dayjs from 'dayjs';
import { cloneDeep, groupBy, max, maxBy, meanBy, min, minBy } from 'lodash';
import moment from 'moment';
import { DATE_FORMAT, UNIT_BILLION } from './constants';
import StockService from './service';
import { getStockData } from './tests';
import { StockBase, StockCoreData, StockData, SupabaseData } from './types';

export const filterData = (
  data: StockData[],
  exclude: string[],
  stockBase: any
) => {
  const result = data.filter((i: StockData) => {
    if (exclude.includes(i.symbol)) {
      return false;
    }

    if (i.change_t0 < 2) {
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
      i.estimated_vol_change > 50 &&
      ((target && risk_b2 && target > risk_b2) ||
        (!risk_b2 && risk_b1 && target && target > risk_b1))
    ) {
      i.potential = true;
      top1.push(i);
    } else {
      rest.push(i);
    }
  });

  rest.sort(
    (a: StockData, b: StockData) =>
      b.estimated_vol_change - a.estimated_vol_change
  );

  return top1.concat(rest);
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
  volumeField = 'dealVolume',
}: {
  fullData?: StockCoreData[];
  listMarkPoints?: StockCoreData[];
  listMarkLines?: any;
  volumeField?: 'dealVolume' | 'totalVolume';
}) => {
  const seriesMarkPoint = getSeriesMarkPoint({
    listMarkPoints,
    offset: 20,
  });
  const markLine = getMarkLine(listMarkLines);

  if (!fullData) return;

  const newData = [...fullData];
  newData.reverse();

  const dates = newData.map((i: StockCoreData) =>
    moment(i.date).format(DATE_FORMAT)
  );
  const prices = newData.map((i: StockCoreData) => [
    i.priceOpen,
    i.priceClose,
    i.priceLow,
    i.priceHigh,
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
  } else if (base_1 && base_3 && base_2 && t0_price && t0_price >= base_2) {
    risk_b1 = (100 * (t0_price - base_1)) / base_1;
    risk_b2 = (100 * (t0_price - base_2)) / base_2;
    target = (100 * (base_3 - t0_price)) / t0_price;
  }

  const startIndex = data.findIndex(
    (i: StockData) => i.date === stockBase.buy_point?.date
  );

  const listData = data.slice(0, startIndex + 1);
  console.log(listData);
  const list_50 = data.slice(startIndex + 1, startIndex + 51);
  const average_50 = meanBy(list_50, 'totalVolume');

  const a = listData.filter((i: StockData) => i.totalVolume > average_50 * 1.2);

  console.log(average_50, a);

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
  dates: [dayjs.Dayjs, dayjs.Dayjs],
  listSymbols: string[]
) => {
  let resFireant;
  if (
    dates[1].format(DATE_FORMAT) === dayjs().format(DATE_FORMAT) &&
    dayjs().hour() < 15 &&
    !localStorage.getItem('turnOffFetchTodayData')
  ) {
    const res = await StockService.getStockDataFromFireant({
      startDate: dayjs().format(DATE_FORMAT),
      endDate: dayjs().format(DATE_FORMAT),
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

export const mapDataFromStockBase = (data: StockBase[]) => {
  const list_all = data.map((i) => i.symbol);
  const list_buyPoint = data.filter((i) => i.buy_point).map((i) => i.symbol);

  const list_blacklist = data
    .filter((i) => i.is_blacklist)
    .map((i) => i.symbol);

  const list_active = data.filter((i) => !i.is_blacklist).map((i) => i.symbol);

  return {
    list_all,
    list_active,
    list_blacklist,
    list_buyPoint,
  };
};

export const getEstimatedVol = (data: StockCoreData) => {
  if (data.date === moment().format(DATE_FORMAT)) {
    // from 9:00 to 11:30
    const morning_time = 60 * 2.5;

    // from 13:00 to 14:45
    const afternoon_time = 60 * 1.75;

    const total_time = morning_time + afternoon_time;
    const current_time = moment().format('HH:mm');
    let estimated_vol;

    if (current_time < '09:00') {
      estimated_vol = 0;
    } else if (current_time >= '09:00' && current_time <= '11:30') {
      const diff_time = moment(current_time, 'HH:mm').diff(
        moment('09:00', 'HH:mm'),
        'minute'
      );
      estimated_vol = data.totalVolume * (total_time / diff_time);
    } else if (current_time >= '11:31' && current_time <= '12:59') {
      estimated_vol = data.totalVolume * (total_time / morning_time);
    } else if (current_time >= '13:00' && current_time <= '14:45') {
      const diff_time = moment(current_time, 'HH:mm').diff(
        moment('13:00', 'HH:mm'),
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
