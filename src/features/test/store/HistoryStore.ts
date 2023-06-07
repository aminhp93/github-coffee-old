// ** Import third party
import produce, {
  applyPatches,
  Draft,
  enablePatches,
  Immutable,
  Patch,
  produceWithPatches,
  setAutoFreeze,
} from 'immer';
import { create } from 'zustand';
import { merge, keyBy } from 'lodash';

// ** Import utils
import { ItemCollection, Item } from '../schema/item.schema';
import { getTransformStyle } from '../utils';

// History state stores the edits made to items in the editor.
// We use immer patches to enable undo/redo functionality.
// @see https://bitbucket.org/teampiscadacloud/webpmp/src/new_editor/PMP/src/components/Item/item.store.ts

// enable immer patches
// see https://immerjs.github.io/immer/patches
enablePatches();

// disable auto freeze for backward compatibility
// some legacy items mutate state directly, so we need to disable freeze until we can refactor the code
setAutoFreeze(false);

type HistoryStore = {
  items: ItemCollection;
  addItems: (item: ItemCollection) => void;
  updateItems: (data: ItemCollection) => void;
  patchItems: (data: ItemCollection) => void;
  deleteItem: () => void;
  redo: () => void;
  undo: () => void;
};

let cursor = -1;
let forwardHistory: Array<Patch[]> = [];
let backwardHistory: Array<Patch[]> = [];

const produceWithHistory = <T = unknown>(fn: (store: Draft<T>) => void) => {
  return (store: Immutable<Draft<T>>) => {
    const [nextState, patches, inversePatches] = produceWithPatches(fn)(store);
    if (patches.length === 0 && inversePatches.length === 0) {
      return nextState;
    }
    // If forward and backward history are not the same length something is wrong.
    if (forwardHistory.length !== backwardHistory.length) {
      throw new Error('History is not the same length');
    }
    // Just save patches if cursor is at the end of the history
    if (cursor === forwardHistory.length) {
      forwardHistory.push(patches);
      backwardHistory.push(inversePatches);
    }
    // If cursor is not at the end of the history, splice the history and save the patches.
    else {
      forwardHistory.splice(cursor + 1, forwardHistory.length - cursor - 1);
      backwardHistory.splice(cursor + 1, backwardHistory.length - cursor - 1);
      forwardHistory.push(patches);
      backwardHistory.push(inversePatches);
    }
    // Increment cursor
    cursor++;
    return nextState;
  };
};

const useHistoryStore = create<HistoryStore>((set, get) => ({
  items: {},
  addItems: (items: ItemCollection) => {
    set(
      produceWithHistory((draft) => {
        const newItems = {
          ...get().items,
          ...items,
        };

        Object.keys(newItems).forEach((id) => {
          if (newItems[id] && newItems[id].currentState) {
            if (Object.keys(items).includes(id)) {
              newItems[id].currentState!.selected = true;
            } else {
              newItems[id].currentState!.selected = false;
            }
          }
        });

        // Find current PV
        const curItems = Object.values(newItems);
        const curPv = curItems.find((item) => item?.type === 'process-view');
        const curPvIndex = curItems.findIndex(
          (item) => item?.type === 'process-view'
        );

        const newPv = {
          ...curPv,
          content: [...curPv!.content, ...Object.keys(items)],
        };

        if (curPvIndex !== -1 && newPv) {
          curItems[curPvIndex] = newPv as Item;
        }

        draft.items = keyBy(curItems, 'id');
      })
    );
  },
  deleteItem: () => {
    set(
      produceWithHistory((draft) => {
        let items = get().items;
        const selectedItems: ItemCollection = {};
        Object.keys(items).forEach((key) => {
          if (items[key].currentState?.selected) {
            selectedItems[key] = items[key];
          }
        });

        const newItems = { ...get().items };

        // Set selected to false
        Object.keys(selectedItems).forEach((id) => {
          delete newItems[id];
        });

        // Find current PV and remove id of item from content of PV
        const curItems = Object.values(newItems);
        const curPv = curItems.find((item) => item?.type === 'process-view');
        if (!curPv) return;
        const curPvIndex = curItems.findIndex(
          (item) => item?.type === 'process-view'
        );
        let newContentPv: string[] = curPv.content;

        Object.keys(selectedItems).forEach((id) => {
          newContentPv = newContentPv.filter((i) => i !== id);
        });

        const newPv = {
          ...curPv,
          content: newContentPv,
        };

        if (curPvIndex !== -1 && newPv) {
          curItems[curPvIndex] = newPv as Item;
        }
        // set Selected to last item
        draft.items = keyBy(curItems, 'id');
      })
    );
  },
  updateItems: (data) => {
    set(
      produceWithHistory((draft) => {
        draft.items = data;
      })
    );
  },
  patchItems: (data: ItemCollection) => {
    console.log('patchItems', data);
    set(
      produceWithHistory((draft) => {
        // Apply the patch to the current state.

        for (const id of Object.keys(data)) {
          const item = draft.items && draft.items[id];
          if (!item) {
            continue;
          }
          merge(item, data[id]);
          if (draft.items) {
            draft.items[id] = item;
          }
        }
      })
    );
  },
  // Apply inverse patches to the current state.
  undo: () => {
    set(
      produce((draft) => {
        // If cursor is at the beginning of the history, do nothing.
        if (cursor < 1) {
          return;
        }
        // Get the inverse patches and apply them.
        const inversePatches = backwardHistory[cursor];
        applyPatches(draft, inversePatches);

        // Update position of item in viewport
        let items = get().items;
        const selectedItems: ItemCollection = {};
        Object.keys(items).forEach((key) => {
          if (items[key].currentState?.selected) {
            selectedItems[key] = items[key];
          }
        });

        for (const id of Object.keys(selectedItems)) {
          const item = draft.items && draft.items[id];
          if (!item) {
            continue;
          }

          const itemSpring = item.currentState?.itemSpring;
          if (itemSpring) {
            const [, viewportApi] = itemSpring;
            viewportApi.start({
              x: item?.legacy?.itemProperties?.transform?.x,
              y: item?.legacy?.itemProperties?.transform?.y,
              transform: getTransformStyle(item),
            });
          }
        }

        // Decrement cursor
        cursor--;
      })
    );
  },
  // Apply forward patches to the current state.
  redo: () => {
    set(
      produce((draft) => {
        // If cursor is at the end of the history, do nothing.
        if (cursor >= forwardHistory.length - 1) {
          return;
        }

        // Get the forward patches and apply them.
        const forwardPatches = forwardHistory[cursor + 1];
        applyPatches(draft, forwardPatches);

        // Update position of item in viewport
        let items = get().items;
        const selectedItems: ItemCollection = {};
        Object.keys(items).forEach((key) => {
          if (items[key].currentState?.selected) {
            selectedItems[key] = items[key];
          }
        });

        for (const id of Object.keys(selectedItems)) {
          const item = draft.items && draft.items[id];
          if (!item) {
            continue;
          }

          const itemSpring = item.currentState?.itemSpring;
          if (itemSpring) {
            const [, viewportApi] = itemSpring;
            viewportApi.start({
              x: item?.legacy?.itemProperties?.transform?.x,
              y: item?.legacy?.itemProperties?.transform?.y,
              transform: getTransformStyle(item),
            });
          }
        }

        // Increment cursor
        cursor++;
      })
    );
  },
}));

export default useHistoryStore;

export const useProcessViewItem = () => {
  let items = useHistoryStore((store) => store.items);
  const processViewList = Object.values(items).filter(
    (i) => i?.type === 'process-view'
  );
  if (processViewList.length === 1) {
    return processViewList[0];
  }
  return undefined;
};

export const useLegacyItemList = () => {
  let items = useHistoryStore((store) => store.items);
  const legacyItemList = Object.values(items).filter(
    (i) => i?.type === 'legacy-item'
  );
  return legacyItemList;
};

export const useItemSelected = () => {
  let items = useHistoryStore((store) => store.items);
  const selectedItems: ItemCollection = {};
  Object.keys(items).forEach((key) => {
    if (items[key].currentState?.selected) {
      selectedItems[key] = items[key];
    }
  });

  return selectedItems;
};
