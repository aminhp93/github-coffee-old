/* eslint-disable @typescript-eslint/no-explicit-any */

export type HistoricalQuote = {
  adjRatio: number;
  buyCount: number;
  buyForeignQuantity: number;
  buyForeignValue: number;
  buyQuantity: number;
  currentForeignRoom: number;
  date: string;
  dealVolume: number;
  key: string;
  priceAverage: number;
  priceBasic: number;
  priceClose: number;
  priceHigh: number;
  priceLow: number;
  priceOpen: number;
  propTradingNetDealValue: number;
  propTradingNetPTValue: number;
  propTradingNetValue: number;
  putthroughValue: number;
  putthroughVolume: number;
  sellCount: number;
  sellForeignQuantity: number;
  sellForeignValue: number;
  sellQuantity: number;
  symbol: string;
  totalValue: number;
  totalVolume: number;
};

export type HistoricalQuoteParams = {
  symbol: string;
  startDate?: string;
  endDate?: string;
  offset?: number;
  limit?: number;
  returnRequest?: boolean;
};

export type Base = {
  base_max: number;
  base_min: number;
  base_percent: number;
  base_length: number;
  startBaseDate: string;
  endBaseDate: string;
};

export type Watchlist = {
  displayIndex: number;
  name: string;
  symbols: string[];
  userName: string;
  watchlistID: number;
};

export type WatchlistCollection = Record<string, Watchlist>;

export type Filter = Pick<
  StockData,
  'change_t0' | 'estimated_vol_change' | 't0_over_base_max'
>;

export type SupabaseData = {
  date: string;
  dealVolume: number;
  priceClose: number;
  priceHigh: number;
  priceLow: number;
  priceOpen: number;
  symbol: string;
  totalValue: number;
  totalVolume: number;
};

export type StockCoreData = {
  adjRatio: number;
  symbol: string;
  date: string;
  priceClose: number;
  priceOpen: number;
  priceHigh: number;
  priceLow: number;
  totalVolume: number;
  dealVolume: number;
  totalValue: number;
};

export interface StockData extends StockCoreData {
  target?: number;
  risk_b1?: number;
  risk_b2?: number;
  potential?: boolean;
  change_t0: number;
  rangeChange_t0: number;
  estimated_vol_change: number;
  t0_over_base_max?: number;
  closetUpperBase?: Base;
  latestBase?: Base;
  backtestData?: StockData[];
  fullData?: StockData[];
}

export type StockBase = {
  id: number;
  buy_point?: {
    date: string;
  };
  created_at: string | null;
  is_blacklist: boolean | null;
  list_base?:
    | {
        id: number;
        value: number;
        startDate?: string;
        endDate?: string;
      }[]
    | null;
  symbol: string;
  config: {
    dataZoom: any;
  };
};

export type StockChartData = {
  dates: string[];
  prices: number[][];
  volumes: number[][];
  seriesMarkPoint: any;
  markLine: any;
};

export type StockInfo = {
  created_at: string;
  updated_at: string;
  start_date: string;
  last_updated: string;
  id: number;
};
