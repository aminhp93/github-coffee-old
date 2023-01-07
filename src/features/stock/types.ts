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
  count_5_day_within_base: {
    list_base: Base[];
  };
  count_10_day_within_base: {
    list_base: Base[];
  };
  last_10_day_summary: {
    strong_buy: HistoricalQuote[];
    strong_sell: HistoricalQuote[];
  };
  estimated_vol_change: number;
  extra_vol: number;
  action: ActionType;
}

export interface ExtraData {
  key: string;
  symbol: string;
  inWatchingWatchList?: boolean;
}

export interface CustomHistoricalQuote extends ExtraData {
  latestHistoricalQuote: HistoricalQuote;
  buySellSignals: BuySellSignals;
}

export type ActionType = 'buy' | 'sell' | 'unknown';

export interface Base {
  list?: (HistoricalQuote | BasePriceSymbol)[];
  index?: number;
  addedData?: HistoricalQuote[];
  buyItem?: HistoricalQuote;
  estimated_vol_change?: number;
  estimated_price_change?: number;
  fullData?: HistoricalQuote[];
  t3?: number;
}

export interface CustomSymbol {
  buySellSignals: BuySellSignals;
  inWatchingWatchList: boolean;
  key: string;
  symbol: string;
  latestHistoricalQuote: HistoricalQuote;
  backtest?: BackTest;
}

export interface BackTest {
  data: BasePriceSymbol[];
  list_base: Base[];
  winCount: number;
  winRate: number;
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

export interface BasePriceSymbol {
  date: string;
  dealVolume: number;
  priceClose: number;
  priceHigh: number;
  priceLow: number;
  priceOpen: number;
  totalVolume: number;
  symbol: string;
}

export interface BasePriceSymbolResponse {
  d: string;
  v: number;
  c: number;
  h: number;
  l: number;
  o: number;
  v2: number;
  s: string;
}
