import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface targetState {
  symbol: string,
  period: string,
  interval: string,
  isValidSymbol: boolean,
}

export const INITIAL_STATE: targetState = {
  symbol: '',
  period: '1y',
  interval: '1d',
  isValidSymbol: false
};

export const targetSlice = createSlice({
  name: 'target',
  initialState: INITIAL_STATE,
  reducers: {
    updateSymbol: (state, action: PayloadAction<string>) => {
      state.symbol = action.payload;
    },
    updatePeriod: (state, action: PayloadAction<string>) => {
      state.period = action.payload;
    },
    updateInterval: (state, action: PayloadAction<string>) => {
      state.interval = action.payload;
    },
    updateValidity: (state, aciton: PayloadAction<boolean>) => {
      state.isValidSymbol = aciton.payload;
    }
  }
})

export const { updateSymbol, updatePeriod, updateInterval, updateValidity } = targetSlice.actions;
export default targetSlice.reducer;
