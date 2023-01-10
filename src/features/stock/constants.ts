import { Filter } from './types';

import moment from 'moment';
import BuySellSignalsColumns from './StockTable/BuySellSignalsColumns';

export const UNIT_BILLION = 1_000_000_000;
export const NUMBER_UNIT_REDUCED = 1000;
export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FORMAT = 'HH:mm';
export const FULL_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const TIME_FRAME = '1';
export const DELAY_TIME = 1_000 * 60;
export const MIN_TOTAL_VOLUME = 100_000;
export const MIN_TOTAL_VALUE = UNIT_BILLION * 5;
export const MIN_MEDIUM_TOTOL_VALUE = UNIT_BILLION * 5;
export const MIN_CHANGE = -1000;
export const MAX_CHANGE = 1000;
const DEFAULT_OFFSET = 20;
export const BACKTEST_COUNT = (50 * DEFAULT_OFFSET) / DEFAULT_OFFSET; // change number to change number of fetching days
export const DEFAULT_DATE = moment();

export const FinancialIndicatorsKeys = [
  'P/E',
  'P/S',
  'P/B',
  'EPS',
  'Tỷ lệ lãi ròng (%)',
  'YOEA (%)',
  'NIM (%)',
  'COF (%)',
  'LAR (%)',
  'LDR (%)',
  'CLR (%)',
  'CTA (%)',
  'ELR (%)',
  'ROA (%)',
  'ROE (%)',
  'CIR (%)',
  'LLRL (%)',
  'LLRNPL (%)',
  'Tỷ lệ nợ xấu (%)',
  'PCL (%)',
];

export const LIST_VN30 = [
  'ACB',
  'BID',
  'BVH',
  'CTG',
  'FPT',
  'GAS',
  'GVR',
  'HDB',
  'HPG',
  'KDH',
  'MBB',
  'MSN',
  'MWG',
  'NVL',
  'PDR',
  'PLX',
  'POW',
  'SAB',
  'SSI',
  'STB',
  'TCB',
  'TPB',
  'VCB',
  'VHM',
  'VIB',
  'VIC',
  'VJC',
  'VNM',
  'VPB',
  'VRE',
];

export const HistoricalQuoteKeys = [
  'buyCount',
  'buyForeignQuantity',
  'buyForeignValue',
  'buyQuantity',
  'currentForeignRoom',
  'date',
  'totalVolume',
  // 'key',
  'priceAverage',
  'priceBasic',
  'priceClose',
  'priceHigh',
  'priceLow',
  'priceOpen',

  'putthroughValue',
  'putthroughVolume',
  'sellCount',
  'sellForeignQuantity',
  'sellForeignValue',
  'sellQuantity',
  // 'symbol',
  'totalValue',
  'totalVolume',
];

export const FundamentalKeys = [
  'avgVolume3m',
  'avgVolume10d',
  'beta',
  'companyType',
  'dividend',
  'dividendYield',
  'eps',
  'foreignOwnership',
  'freeShares',
  'high52Week',
  'insiderOwnership',
  'institutionOwnership',
  'low52Week',
  'marketCap',
  'netProfit_TTM',
  'pe',
  'priceChange1y',
  'sales_TTM',
  'sharesOutstanding',
  // 'symbol',
];

export const NoDataKeys = [
  'adjRatio', // HistoricalQuote
  'propTradingNetDealValue', // HistoricalQuote
  'propTradingNetPTValue', // HistoricalQuote
  'propTradingNetValue', // HistoricalQuote
];

export const TYPE_INDICATOR_OPTIONS = [
  'BuySellSignals',
  'InDayReview',
  'HistoricalQuote',
  'Fundamental',
  'FinancialIndicators',
  'NoData',
];

export const DEFAULT_TYPE_INDICATOR_OPTIONS = ['BuySellSignals'];

export const BUY_SELL_SIGNNAL_KEYS = {
  totalValue_last20_min: 1,
  changePrice_buy: 2,
  changePrice_sell: -2,
  count_5_day_within_base: 1,
  count_10_day_within_base: 1,
  count_10_day_buy: 3,
  count_10_day_sell: 3,
  estimated_vol_change: 20,
  buy_sell_count__buy: 1.3,
  buy_sell_count__sell: 0.7,
  buy_sell_vol__buy: 1.3,
  buy_sell_vol__sell: 0.7,
};

export const DEFAULT_FILTER: Filter = {
  currentWatchlist: null,
  totalValue_last20_min: 1,
  changePrice_min: 2,
  changePrice_max: 5,
  have_base_in_5_day: false,
  have_base_in_10_day: false,
  count_10_day_buy_min: 3,
  count_10_day_sell_min: 3,
  estimated_vol_change_min: 20,
  have_extra_vol: false,
  only_buy_sell: true,
};

export const BACKTEST_FILTER = {
  change_t0: DEFAULT_FILTER.changePrice_min,
  change_t3: 0,
  change_t0_vol: DEFAULT_FILTER.estimated_vol_change_min,
  change_buyPrice: 2,
  num_high_vol_than_t0: 0,
};

export const DEFAULT_SETTINGS: any = {
  bordered: true,
  size: 'small',
  showHeader: true,
  showSorterTooltip: false,
  pagination: {
    position: ['bottomRight'],
    pageSizeOptions: ['10', '20', '30'],
    showSizeChanger: true,
  },
};

export const DEFAULT_COLUMNS = [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    sorter: (a: any, b: any) => a['symbol'].localeCompare(b['symbol']),
  },
  {
    title: 'BuySellSignals',
    children: BuySellSignalsColumns(),
  },
];

export const NO_DATA_COLUMN = NoDataKeys.map((i) => {
  return {
    title: i,
    dataIndex: i,
    key: i,
    align: 'right',
    sorter: (a: any, b: any) => a[i] - b[i],
    render: (data: any) => {
      if (typeof data === 'number') {
        if (data > 1_000) {
          return Number(data.toFixed(0)).toLocaleString();
        }
        return Number(data.toFixed(1)).toLocaleString();
      }
      return data;
    },
  };
});

export const HISTORICAL_QUOTE_COLUMN = HistoricalQuoteKeys.map((i) => {
  if (i === 'date') {
    return {
      title: 'dateeeeeeeee',
      dataIndex: i,
      key: i,
      render: (text: string) => moment(text).format(DATE_FORMAT),
    };
  }
  return {
    title: i,
    dataIndex: i,
    key: i,
    align: 'right',
    width: 200,
    sorter: (a: any, b: any) => a[i] - b[i],
    render: (data: any) => {
      if (typeof data === 'number') {
        if (data > 1_000) {
          return Number(data.toFixed(0)).toLocaleString();
        }
        return Number(data.toFixed(1)).toLocaleString();
      }
      return data;
    },
  };
});

export const FUNDAMENTAL_COLUMN = FundamentalKeys.map((i) => {
  return {
    title: i,
    dataIndex: i,
    key: i,
    sorter: (a: any, b: any) => a[i] - b[i],
    align: 'right',
    render: (data: any) => {
      if (typeof data === 'number') {
        if (data > 1_000) {
          return Number(data.toFixed(0)).toLocaleString();
        }
        return Number(data.toFixed(1)).toLocaleString();
      }
      return data;
    },
  };
});

export const FINANCIAL_INDICATORS_COLUMN: any = FinancialIndicatorsKeys.map(
  (i) => {
    return {
      // remove all whitespace
      title: i.replace(/\s/g, ''),
      dataIndex: i,
      key: i,
      sorter: (a: any, b: any) => a[i] - b[i],
      align: 'right',
      render: (data: any) => {
        if (typeof data === 'number') {
          if (data > 1_000) {
            return Number(data.toFixed(0)).toLocaleString();
          }
          return Number(data.toFixed(1)).toLocaleString();
        }
        return data;
      },
    };
  }
);
