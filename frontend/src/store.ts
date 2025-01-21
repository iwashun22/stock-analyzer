import { configureStore } from '@reduxjs/toolkit';
import targetReducer from './features/targetSlice';
import graphReducer from './features/graphSlice';

export const store = configureStore({
  reducer: {
    target: targetReducer,
    indicators: graphReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;