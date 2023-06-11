import produce from 'immer';
import { create } from 'zustand';
import { StatusCollection } from './types';

type StatusStore = {
  status: StatusCollection;
  setStatus: (status: StatusCollection) => void;
};

const useStatusStore = create<StatusStore>((set, get) => ({
  status: {},
  setStatus: (status: StatusCollection) =>
    set(
      produce((draft) => {
        draft.status = status;
      })
    ),
}));

export default useStatusStore;
