import produce from 'immer';
import { create } from 'zustand';
import { WatchlistCollection } from './Stock.types';

type StockStore = {
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
  watchlist: WatchlistCollection | null;
  setWatchlist: (watchlist: WatchlistCollection) => void;
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
}));

export default useStockStore;
