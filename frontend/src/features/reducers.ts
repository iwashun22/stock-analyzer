import { combineReducers } from '@reduxjs/toolkit';
import targetReducer from './targetSlice';
import graphReducer from './graphSlice';

const rootReducer = combineReducers({
  target: targetReducer,
  graph: graphReducer
});

export default rootReducer;