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
      state.push({
        id: state.length + 1,
        name: `name_${state.length + 1}`,
      });
    },
    update: (state, action: any) => {
      const index = state.findIndex((i) => i.id === action.payload.id);
      if (index === -1) return state;
      state[index] = {
        id: action.payload.id,
        name: `name_${action.payload.id}_updated_${new Date().getTime()}`,
      };
    },
    remove: (state, action: any) => {
      return state.filter((i) => i.id !== action.payload.id);
    },
    makeRandom: (state) => {
      return shuffle(state);
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
