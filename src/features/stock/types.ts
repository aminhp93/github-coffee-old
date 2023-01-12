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

export interface FundamentalsParams {
  symbol: string;
}

export interface BuySellSignals {
  totalValue_last20_min: number;
  averageVolume_last5: number;
  changeVolume_last5: number;
  changePrice: number;
  count_5_day_within_base: Base[];
  count_10_day_within_base: Base[];
  last_10_day_summary: {
    strong_buy: BackTestSymbol[];
    strong_sell: BackTestSymbol[];
  };
  estimated_vol_change: number;
  extra_vol: number;
  action: ActionType;
}

export interface ExtraData {
  key: string;
  symbol: string;
  inWatchingWatchList: boolean;
}

export type ActionType = 'buy' | 'sell' | 'unknown';

export interface Base {
  list: BackTestSymbol[];
  buyIndex: number | null;
  change_t0_vol: number | null;
  change_t0: number | null;
  change_t3: number | null;
  change_buyPrice: number | null;
  num_high_vol_than_t0: number | null;
  base_max: number | null;
  base_min: number | null;
}

export interface CustomSymbol {
  buySellSignals: BuySellSignals;
  inWatchingWatchList: boolean;
  key: string;
  symbol: string;
  last20HistoricalQuote: BackTestSymbol[]; // last 20 days
  backtest: BackTest | null;
}

export interface BackTest {
  filteredBase: Base[];
  listBase: Base[];
  winCount: number;
  winRate: number;
  fullData: BackTestSymbol[];
}

export interface Watchlist {
  displayIndex: number;
  name: string;
  symbols: string[];
  userName: string;
  watchlistID: number;
}

export interface Filter {
  currentWatchlist: Watchlist | null;
  totalValue_last20_min: number;
  changePrice_min: number;
  changePrice_max: number;
  have_base_in_5_day: boolean;
  have_base_in_10_day: boolean;
  count_10_day_buy_min: number;
  count_10_day_sell_min: number;
  estimated_vol_change_min: number;
  have_extra_vol: boolean;
  only_buy_sell: boolean;
}

export interface BackTestSymbol {
  date: string;
  dealVolume: number;
  priceClose: number;
  priceHigh: number;
  priceLow: number;
  priceOpen: number;
  totalVolume: number;
  symbol: string;
}

export interface SimplifiedBackTestSymbol {
  d: string;
  v: number;
  c: number;
  h: number;
  l: number;
  o: number;
  v2: number;
  s: string;
}

export interface FilterBackTest {
  change_t0: number;
  change_t0_vol: number;
  num_high_vol_than_t0: number;
}
