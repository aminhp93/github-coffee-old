import produce from 'immer';
import { create } from 'zustand';

type StockStore = {
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
};

const useStockStore = create<StockStore>((set, get) => ({
  selectedSymbol: '',
  setSelectedSymbol: (symbol: string) =>
    set(
      produce((draft) => {
        draft.selectedSymbol = symbol;
      })
    ),
}));

export default useStockStore;
