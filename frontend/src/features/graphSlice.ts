import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface graph {
  indicator: string,
  id: string,
  params: object
}
export interface graphState {
  list: Array<graph>
}

const initialState: graphState = {
  list: [{ indicator: 'SMA', id: generateId(), params: { ranges: '12' }}]
}

function generateId(): string {
  return Math.random().toString(16).split('.')[1].substring(0, 8);
}
export const graphSlice = createSlice({
  name: 'indicators',
  initialState,
  reducers: {
    loadGraph: (state, action: PayloadAction<Array<Omit<graph, "id">>>) => {
      state.list = [];
      action.payload.forEach(item => {
        state.list.push({
          id: generateId(),
          ...item
        })
      })
    },
    addGraph: (state, action: PayloadAction<Omit<graph, "id">>) => {
      state.list.push({
        id: generateId(),
        indicator: action.payload.indicator,
        params: {
          ...action.payload.params
        }
      })
    },
    deleteGraph: (state, action: PayloadAction<graph["id"]>) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
    modifyGraph: (state, action: PayloadAction<graph>) => {
      state.list = state.list.map(item => {
        if (item.id == action.payload.id) {
          return {
            ...action.payload
          }
        }
        return item;
      })
    }
  }
})

export const { loadGraph, addGraph, deleteGraph, modifyGraph } = graphSlice.actions;
export default graphSlice.reducer;
