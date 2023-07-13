import produce from 'immer';
import { create } from 'zustand';
import { WatchlistCollection, Watchlist } from './Stock.types';

type StockStore = {
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
  watchlist: WatchlistCollection | null;
  setWatchlist: (watchlist: WatchlistCollection) => void;
  selectedWatchlist: Watchlist | null;
  setSelectedWatchlist: (watchlist: Watchlist) => void;
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
}));

export default useStockStore;
