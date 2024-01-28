// ** Third Party Imports
import produce from 'immer';
import { create } from 'zustand';
type Mode = 'view' | 'select' | 'pan';

export type ItemStore = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

const useEditorStore = create<ItemStore>((set, get) => ({
  mode: 'select',
  setMode: (mode) =>
    set(
      produce<ItemStore>((draft) => {
        draft.mode = mode;
      })
    ),
}));

export default useEditorStore;
