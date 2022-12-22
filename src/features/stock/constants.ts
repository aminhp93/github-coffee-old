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
  count_5_day_within_base: 5,
  count_10_day_within_base: 5,
  count_10_day_buy: 3,
  count_10_day_sell: 3,
  estimated_vol_change: 20,
  buy_sell_count__buy: 1.3,
  buy_sell_count__sell: 0.7,
  buy_sell_vol__buy: 1.3,
  buy_sell_vol__sell: 0.7,
};

export const DEFAULT_FILTER = {
  totalValue_last20_min: 1,
  changePrice_min: -20,
  changePrice_max: 20,
  have_base_in_5_day: false,
  have_base_in_10_day: false,
  count_10_day_buy_min: 3,
  count_10_day_sell_min: 3,
  estimated_vol_change_min: MIN_CHANGE,
  have_extra_vol: false,
};
