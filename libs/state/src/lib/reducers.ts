import { combineReducers, Reducer } from '@reduxjs/toolkit';
import userReducer from './slices/user.slice';

export interface RootState {
  user: ReturnType<typeof userReducer>;
}

export const rootReducer: Reducer<RootState> = combineReducers({
  user: userReducer,
});
