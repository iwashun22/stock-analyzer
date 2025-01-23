import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface targetState {
  symbol: string,
  period: string,
  isValidSymbol: boolean,
}

export const INITIAL_STATE: targetState = {
  symbol: '',
  period: '1y',
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
    updateValidity: (state, aciton: PayloadAction<boolean>) => {
      state.isValidSymbol = aciton.payload;
    }
  }
})

export const { updateSymbol, updatePeriod, updateValidity } = targetSlice.actions;
export default targetSlice.reducer;
