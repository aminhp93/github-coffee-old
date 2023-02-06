export interface FinancialIndicators {
  'P/E': number;
  'P/S': number;
  'P/B': number;
  EPS: number;
  'Tỷ lệ lãi ròng (%)': number;
  'YOEA (%)': number;
  'NIM (%)': number;
  'COF (%)': number;
  'LAR (%)': number;
  'LDR (%)': number;
  'CLR (%)': number;
  'CTA (%)': number;
  'ELR (%)': number;
  'ROA (%)': number;
  'ROE (%)': number;
  'CIR (%)': number;
  'LLRL (%)': number;
  'LLRNPL (%)': number;
  'Tỷ lệ nợ xấu (%)': number;
  'PCL (%)': number;
}

export interface Fundamental {
  avgVolume3m: number;
  avgVolume10d: number;
  beta: number;
  companyType: number;
  dividend: number;
  dividendYield: number;
  eps: number;
  foreignOwnership: number;
  freeShares: number;
  high52Week: number;
  insiderOwnership: number;
  institutionOwnership: number;
  low52Week: number;
  marketCap: number;
  netProfit_TTM: number;
  pe: number;
  priceChange1y: number;
  sales_TTM: number;
  sharesOutstanding: number;
  symbol: string;
}

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
  startBaseIndex: number;
  endBaseIndex: number;
  change_t0_vol: number;
  change_t0: number;
  num_high_vol_than_t0: number;
  base_max: number;
  base_min: number;
  change_t3?: number | null;
  base_percent: number;
  closestUpperBaseIndex?: number;
  upperPercent?: number;
  closestLowerBaseIndex?: number;
  lowerPercent?: number;
  min_change_in_20_days?: number;
  min_in_20_days_without_break_base_index?: number;
  max_change_in_20_days?: number;
  max_in_20_days_without_break_base_index?: number;
  startBaseDate?: string;
  endBaseDate?: string;
}
export interface Watchlist {
  displayIndex: number;
  name: string;
  symbols: string[];
  userName: string;
  watchlistID: number;
}

export type Filter = Pick<StockData, 'change_t0' | 'estimated_vol_change'>;

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
  change_t0: number;
  estimated_vol_change: number;
  t0_over_base_max?: number;
  closetUpperBase?: Base;
  latestBase?: Base;
  backtestData?: StockData[];
  fullData?: StockData[];
}
