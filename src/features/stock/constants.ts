export const START_DATE_STOCK_SUPABASE = '2021-01-01';
export const UNIT_BILLION = 1_000_000_000;
export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FRAME = '1';
export const DELAY_TIME = 1_000 * 60;
export const MIN_TOTAL_VOLUME = 100_000;
export const MIN_TOTAL_VALUE = UNIT_BILLION * 5;
export const MIN_MEDIUM_TOTOL_VALUE = UNIT_BILLION * 5;

export const GET_FIELD_STOCK_SUPABASE =
  'date,symbol,priceClose,priceHigh,priceLow,priceOpen,dealVolume,totalVolume,totalValue,adjRatio';

export const LIST_TESTING_FIELDS = [
  'dealVolume',
  'priceClose',
  'priceHigh',
  'priceLow',
  'priceOpen',
  'totalValue',
  'totalVolume',
  'adjRatio',
];
