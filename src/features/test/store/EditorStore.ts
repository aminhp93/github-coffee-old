// ** Third Party Imports
import produce from 'immer';
import { create } from 'zustand';
import { merge } from 'lodash';

type Mode = 'view' | 'select' | 'pan';

export type ItemStore = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  test: any;
  setTest: (data: any) => void;
};

const useEditorStore = create<ItemStore>((set, get) => ({
  mode: 'select',
  setMode: (mode) =>
    set(
      produce<ItemStore>((draft) => {
        draft.mode = mode;
      })
    ),
  test: {
    2: {
      currentState: {
        frame: {
          x: 123,
          y: 213,
          width: 123,
          height: 123,
        },
        itemSpring: [123, 123],
      },
    },
  },
  setTest: (data: any) =>
    set(
      produce((draft) => {
        const xxx = draft.test[2];
        // const xxx = get().test[2];
        merge(xxx, data[2]);
        draft.test[2] = xxx;
      })
    ),
}));

export default useEditorStore;
