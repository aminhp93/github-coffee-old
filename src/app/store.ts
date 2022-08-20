import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from 'features/counter/counterSlice';
import demoReducer from 'features/demo/demoSlice';
import userReducer from 'features/user/userSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    demo: demoReducer,
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
