/* eslint-disable @typescript-eslint/no-explicit-any */

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

export const START_DATE: any = {
  OCB: '2021-01-28',
  MSB: '2020-12-23',
  ABB: '2020-12-28',
  BVB: '2020-07-10',
  AAT: '2021-03-24',
  KHG: '2021-07-19',
  PAS: '2020-09-21',
  SGB: '2020-10-15',
  SSB: '2021-03-24',
  SCG: '2021-04-12',
  SSH: '2021-08-04',
  PGB: '2020-12-24',
  NAB: '2020-10-09',
  BAF: '2021-12-03',
  APH: '2020-07-28',
  DXS: '2021-07-15',
};
