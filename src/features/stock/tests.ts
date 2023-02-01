import { getLatestBase, getClosestUpperBase } from './utils';
import StockService from './service';

export const expectedResult = () => {
  // From 2022-01-01 to 2022-01-31

  // 9 symbols

  // HSX: VPB, VND, FCN
  const VPB = {
    buyDate: '2022-01-03',
  };

  // HNX: SHS

  // UPCOM: BSR, C4G
};

export const getRealResult = async (symbol: string) => {
  const startDate = '2022-01-01';
  const endDate = '2022-12-31';
  const listSymbols = [symbol];

  const res = await StockService.getStockDataFromSupabase({
    startDate,
    endDate,
    listSymbols,
  });
  console.log(res);
  if (!res || !res.data) return;

  // Filter list with change t0 > 2%
  const list_t0_greater_than_2_percent: any = [];
  res.data.forEach((item: any, index: number) => {
    if (index + 1 === res.data.length) return;
    const today_close_price = item.priceClose;
    const yesterday_close_price = res.data[index + 1].priceClose;
    const change_t0 =
      (100 * (today_close_price - yesterday_close_price)) /
      yesterday_close_price;
    if (change_t0 > 2) {
      item.change_t0 = change_t0;

      // Check if at the break point have latest base
      const latestBase = getLatestBase(res.data.slice(index + 1));
      if (latestBase) {
        item.latestBase = latestBase;
        item.t0_over_base_max =
          (100 * (item.priceHigh - latestBase.base_max)) / latestBase.base_max;
        item.closetUpperBase = getClosestUpperBase(res.data, latestBase);
        list_t0_greater_than_2_percent.push(item);
      }
    }
  });

  // Check if at the break point have gap

  const result = list_t0_greater_than_2_percent;
  console.log('list_t0_greater_than_2_percent', result);
  return {
    result,
    fullData: res.data,
  };
};
