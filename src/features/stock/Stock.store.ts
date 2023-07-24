import produce from 'immer';
import { create } from 'zustand';
import { WatchlistCollection, Watchlist, StockInfo } from './Stock.types';

type StockStore = {
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
  watchlist: WatchlistCollection | null;
  setWatchlist: (watchlist: WatchlistCollection) => void;
  selectedWatchlist: Watchlist | null;
  setSelectedWatchlist: (watchlist: Watchlist) => void;
  stockInfo: StockInfo | null;
  setStockInfo: (stockInfo: StockInfo) => void;
};

const useStockStore = create<StockStore>((set, get) => ({
  selectedSymbol: '',
  setSelectedSymbol: (symbol: string) =>
    set(
      produce((draft) => {
        draft.selectedSymbol = symbol;
      })
    ),
  watchlist: null,
  setWatchlist: (watchlist: WatchlistCollection) =>
    set(
      produce((draft) => {
        draft.watchlist = watchlist;
      })
    ),
  selectedWatchlist: null,
  setSelectedWatchlist: (watchlist: Watchlist) =>
    set(
      produce((draft) => {
        draft.selectedWatchlist = watchlist;
      })
    ),
  stockInfo: null,
  setStockInfo: (stockInfo: StockInfo) =>
    set(
      produce((draft) => {
        draft.stockInfo = stockInfo;
      })
    ),
}));

export default useStockStore;
