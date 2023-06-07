import produce from 'immer';
import { create } from 'zustand';
import { TagCollection } from './types';

type TagStore = {
  tags: TagCollection;
  setTags: (tags: TagCollection) => void;
};

const useTagStore = create<TagStore>((set, get) => ({
  tags: {},
  setTags: (tags: TagCollection) =>
    set(
      produce((draft) => {
        draft.tags = tags;
      })
    ),
}));

export default useTagStore;
