/* eslint-disable @typescript-eslint/no-explicit-any */
// Import libaries
import dayjs from 'dayjs';
import { keyBy, meanBy, minBy } from 'lodash';

// Import component
import StockService from '../service';
import { SupabaseData } from '../Stock.types';
import { getStockDataFromSupabase } from '../utils';
import { DATE_FORMAT, UNIT_BILLION } from '../constants';

export const getRowClass = (params: any) => {
  if (params.node.data.danger) {
    return 'danger-row';
  }
};

export const getData = async (date: dayjs.Dayjs | undefined) => {
  if (!date) return;

  const resStockBase = await StockService.getAllStockBase();
  if (resStockBase.data) {
    const res = await StockService.getStockDataFromSupabase({
      startDate: date.add(-1, 'month').format(DATE_FORMAT),
      endDate: date.format(DATE_FORMAT),
      listSymbols: resStockBase.data.map((i) => i.symbol),
    });

    let fundamental = await StockService.getFundamentalsDataFromFireant(
      resStockBase.data.map((i) => i.symbol)
    );

    const stockBaseObj = keyBy(resStockBase.data, 'symbol');

    const keyByFundamental = keyBy(fundamental, 'symbol');

    const newAllStocks = getStockDataFromSupabase(res.data as SupabaseData[]);

    const newListStocks = newAllStocks.map((i) => {
      return {
        symbol: i.symbol,
        minValue: minBy(i.fullData, 'totalValue')?.totalValue,
        marketCap: keyByFundamental[i.symbol]?.marketCap,
        is_blacklist: stockBaseObj[i.symbol]?.is_blacklist,
        averageChange: meanBy(i.fullData, (i) =>
          i.change_t0 > 0 ? i.change_t0 : -i.change_t0
        ),
        averageRangeChange: meanBy(i.fullData, 'rangeChange_t0'),
      };
    });

    newListStocks.forEach((i: any) => {
      if (
        i.minValue < 2 * UNIT_BILLION &&
        i.marketCap < 1000 * UNIT_BILLION &&
        !i.is_blacklist
      ) {
        i.danger = true;
      } else {
        i.danger = false;
      }
    });

    // sort by minValue
    newListStocks.sort((a: any, b: any) => {
      return a.minValue - b.minValue;
    });

    return newListStocks;
  }
};
