// ** Third Party Imports
import produce from 'immer';
import { create } from 'zustand';

export type EditorStore = {
  mode: 'select' | 'pan';
  setMode: (mode: 'select' | 'pan') => void;
  selected: string[];
  setSelected: (selections: string[]) => void;
};

const useEditorStore = create<EditorStore>((set) => ({
  mode: 'pan',
  setMode: (mode) =>
    set(
      produce<EditorStore>((draft) => {
        draft.mode = mode;
      })
    ),
  selected: [],
  setSelected: (selected) =>
    set(
      produce<EditorStore>((draft) => {
        draft.selected = selected;
      })
    ),
}));

export default useEditorStore;
