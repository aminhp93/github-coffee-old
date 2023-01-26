import moment from 'moment';
import BuySellSignalsColumns from './StockTable/BuySellSignalsColumns';
import InDayReviewColumns from './StockTable/InDayReviewColumns';
import { minBy, maxBy } from 'lodash';
import {
  HistoricalQuote,
  ExtraData,
  ActionType,
  Filter,
  BackTestSymbol,
  Base,
  Watchlist,
} from './types';

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
export const DEFAULT_START_DATE = moment().add(-30, 'days');
export const DEFAULT_END_DATE = moment();

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
  have_base_in_5_day: false,
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

export const getColumns = (checkedList: any) => {
  const columns: any = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      sorter: (a: any, b: any) => a['symbol'].localeCompare(b['symbol']),
    },
  ];
  if (checkedList.includes('HistoricalQuote')) {
    columns.push({
      title: 'Historical Quotes',
      children: HISTORICAL_QUOTE_COLUMN,
    });
  }

  if (checkedList.includes('Fundamental')) {
    columns.push({
      title: 'Fundamentals',
      children: FUNDAMENTAL_COLUMN,
    });
  }

  if (checkedList.includes('FinancialIndicators')) {
    columns.push({
      title: 'FinancialIndicators',
      children: FINANCIAL_INDICATORS_COLUMN,
    });
  }

  if (checkedList.includes('BuySellSignals')) {
    columns.push({
      title: 'BuySellSignals',
      children: BuySellSignalsColumns(),
    });
  }

  if (checkedList.includes('NoData')) {
    columns.push({
      title: 'NoData',
      children: NO_DATA_COLUMN,
    });
  }

  if (checkedList.includes('InDayReview')) {
    columns.push({
      title: 'InDayReview',
      children: InDayReviewColumns,
    });
  }

  return columns;
};

export const LIST_ALL_SYMBOLS = [
  'HPG',
  'HSG',
  'NKG',
  'SHI',
  'SMC',
  'TLH',
  'ABB',
  'ACB',
  'BID',
  'BVB',
  'CTG',
  'HDB',
  'KLB',
  'LPB',
  'MBB',
  'MSB',
  'NAB',
  'NVB',
  'OCB',
  'PGB',
  'SHB',
  'STB',
  'TCB',
  'TPB',
  'VIB',
  'VPB',
  'EIB',
  'SGB',
  'SSB',
  'VBB',
  'VCB',
  'AGG',
  'D2D',
  'DIG',
  'DXG',
  'HDC',
  'HDG',
  'HPX',
  'IJC',
  'KDH',
  'LHG',
  'NLG',
  'NTL',
  'NVL',
  'PDR',
  'SJS',
  'TDC',
  'TIG',
  'TIP',
  'KBC',
  'SCR',
  'KHG',
  'CRE',
  'HQC',
  'CKG',
  'AGR',
  'BSI',
  'BVS',
  'CTS',
  'FTS',
  'HCM',
  'MBS',
  'ORS',
  'SHS',
  'SSI',
  'TVB',
  'VCI',
  'VIX',
  'VND',
  'VDS',
  'SBS',
  'BSR',
  'OIL',
  'PLX',
  'PVD',
  'PVS',
  'PVC',
  'ADS',
  'DLG',
  'APG',
  'PAS',
  'TCD',
  'DRC',
  'OGC',
  'DDG',
  'AMV',
  'FIT',
  'MST',
  'HAX',
  'DPR',
  'VGS',
  'IPA',
  'MBG',
  'HHS',
  'ITC',
  'BCM',
  'LDG',
  'GEG',
  'LCG',
  'EVG',
  'AAT',
  'KOS',
  'VC3',
  'HVN',
  'TTF',
  'DDV',
  'PTB',
  'PET',
  'DXS',
  'CSV',
  'FIR',
  'NT2',
  'NBB',
  'DPG',
  'SAM',
  'VGI',
  'SSH',
  'MIG',
  'ABS',
  'FCN',
  'CTF',
  'C4G',
  'KSB',
  'IDI',
  'PNJ',
  'TCM',
  'GMD',
  'CTR',
  'SCG',
  'CTD',
  'SZC',
  'DHC',
  'HBC',
  'VPI',
  'VJC',
  'BCG',
  'VPG',
  'HUT',
  'APH',
  'ANV',
  'REE',
  'HNG',
  'VGC',
  'VHC',
  'HHV',
  'PHR',
  'TNG',
  'AAA',
  'CEO',
  'GAS',
  'PVT',
  'HAH',
  'GVR',
  'BVH',
  'BAF',
  'PC1',
  'GIL',
  'ASM',
  'PAN',
  'SBT',
  'DGW',
  'DBC',
  'FRT',
  'TCH',
  'VRE',
  'DPM',
  'FPT',
  'CII',
  'VCG',
  'DCM',
  'POW',
  'IDC',
  'HAG',
  'MWG',
  'GEX',
  'DGC',
  'HT1',
  'BCC',
];

export const getAction = ({
  changePrice,
  latestBase,
  estimated_vol_change,
  extraData,
}: {
  changePrice: number;
  latestBase: Base | null;
  estimated_vol_change: number;
  extraData: ExtraData;
}): ActionType => {
  let action: ActionType = 'unknown';

  if (changePrice > 2 && latestBase && estimated_vol_change > 20) {
    action = 'buy';
  }

  // BUY 2
  // 1. Have base: base_count > 0
  // 2. Price change > 2%

  // SELL
  // 1. in watching watchlist
  // 2. Price change < -2%
  if (changePrice < -2 && extraData?.inWatchingWatchList) {
    action = 'sell';
  }

  return action;
};

export const getEstimatedVol = (data: HistoricalQuote) => {
  const start_time = moment().set('hour', 9).set('minute', 0);
  const default_end_time = moment().set('hour', 14).set('minute', 45);
  const default_diff_time = default_end_time.diff(start_time, 'minute') - 90;

  const end_time = moment();
  let diff_time = 0;
  if (end_time.isBefore(moment('11:30', 'HH:mm'))) {
    diff_time = end_time.diff(start_time, 'minute');
  } else if (
    end_time.isAfter(moment('13:00', 'HH:mm')) &&
    end_time.isBefore(moment('14:45', 'HH:mm'))
  ) {
    diff_time = end_time.diff(start_time, 'minute') - 90;
  } else {
    diff_time =
      end_time.diff(start_time, 'minute') -
      end_time.diff(moment('11:30', 'HH:mm'), 'minute');
  }
  let estimated_vol = (data.dealVolume * default_diff_time) / diff_time;
  if (
    moment(data.date).format(DATE_FORMAT) !== moment().format(DATE_FORMAT) ||
    (moment(data.date).format(DATE_FORMAT) !== moment().format(DATE_FORMAT) &&
      end_time.isAfter(moment('15:00', 'HH:mm')))
  ) {
    estimated_vol = data.dealVolume;
  }

  return estimated_vol;
};

export const getBase_min_max = (data: BackTestSymbol[]) => {
  return {
    base_min: minBy(data, 'priceLow')?.priceLow,
    base_max: maxBy(data, 'priceHigh')?.priceHigh,
  };
};

export const getListAllSymbols = (listWatchlist?: Watchlist[]) => {
  return LIST_ALL_SYMBOLS;

  // // get list all symbol from all watchlist
  // const LIST_WATCHLIST_INCLUDES = [
  //   476435, // 1757_thep
  //   476706, // 8355_ngan_hang
  //   476714, // 8633_dau_co_va_BDS
  //   476720, // 8781_chung_khoan
  //   476724, // 0533_dau_khi
  //   737544, // thanh_khoan_vua
  //   927584, // dau tu cong
  // ];
  // let listAllSymbols = listWatchlist
  //   .filter((i: Watchlist) => LIST_WATCHLIST_INCLUDES.includes(i.watchlistID))
  //   .reduce((acc: any, item: any) => {
  //     return [...acc, ...item.symbols];
  //   }, []);

  // // unique listAllSYmbols
  // listAllSymbols = uniq(listAllSymbols);
  // // console.log(listAllSymbols);
  //  return listAllSymbols;
};
