import { createSlice } from '@reduxjs/toolkit';
import { RootState, AppThunk } from 'app/store';
import { shuffle } from 'lodash';

const demoSlice = createSlice({
  name: 'demo',
  initialState: [
    {
      id: 1,
      name: 'name_1',
    },
    {
      id: 2,
      name: 'name_2',
    },
  ],
  reducers: {
    add: (state) => {
      const newState = [...state];
      newState.push({
        id: newState.length + 1,
        name: `name_${newState.length + 1}`,
      });
      return newState;
    },
    update: (state, action: any) => {
      const newState = [...state];
      const index = newState.findIndex((i) => i.id === action.payload.id);
      if (index === -1) return state;
      newState[index] = {
        id: action.payload.id,
        name: `name_${action.payload.id}_updated_${new Date().getTime()}`,
      };
      return newState;
    },
    remove: (state, action: any) => {
      const newState = [...state];
      const index = newState.findIndex((i) => i.id === action.payload.id);
      if (index === -1) return state;
      newState.splice(index, 1);
      return newState;
    },
    makeRandom: (state) => {
      const newState = [...state];
      return shuffle(newState);
    },
  },
});

export const { add, update, remove, makeRandom } = demoSlice.actions;

export const fetchRandom = (): AppThunk => async (dispatch, getState) => {
  // const res = await fetchRandomDemo()
  getState();
  dispatch(makeRandom());
};

export default demoSlice.reducer;
