export interface HistoricalQuote {
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
}

export interface HistoricalQuoteParams {
  symbol: string;
  startDate?: string;
  endDate?: string;
  offset?: number;
  limit?: number;
  returnRequest?: boolean;
}

export interface Base {
  base_max: number;
  base_min: number;
  base_percent: number;
  base_length: number;
  startBaseDate: string;
  endBaseDate: string;
}
export interface Watchlist {
  displayIndex: number;
  name: string;
  symbols: string[];
  userName: string;
  watchlistID: number;
}

export type Filter = Pick<
  StockData,
  'change_t0' | 'estimated_vol_change' | 't0_over_base_max'
>;

export interface SupabaseData {
  date: string;
  dealVolume: number;
  priceClose: number;
  priceHigh: number;
  priceLow: number;
  priceOpen: number;
  symbol: string;
  totalValue: number;
  totalVolume: number;
}

export interface StockCoreData {
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
}

export interface StockData extends StockCoreData {
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

export interface StockBase {
  id: number;
  buy_point?: {
    date: string;
  };
  created_at: string;
  is_blacklist: boolean;
  list_base?: {
    id: number;
    value: number;
    startDate?: string;
    endDate?: string;
  }[];
  symbol: string;
}
