import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { IUser } from 'types';

const userSlice = createSlice({
  name: 'user',
  initialState: {} as IUser,
  reducers: {
    update: (state, action: any) => {
      return action.payload;
    },
  },
});

export const { update } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
