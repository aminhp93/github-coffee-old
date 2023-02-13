import { createSlice } from '@reduxjs/toolkit';

const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    selectedSymbol: '',
  },
  reducers: {
    updateSelectedSymbol: (state, action: any) => {
      console.log(action);
      state.selectedSymbol = action.payload;
    },
  },
});

export const { updateSelectedSymbol } = stockSlice.actions;

export const selectSelectedSymbol = (state: any) => state.stock.selectedSymbol;

export default stockSlice.reducer;
