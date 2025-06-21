import { useSelector as _useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../reducers';

// https://react-redux.js.org/using-react-redux/static-typing
export const useSelector: TypedUseSelectorHook<RootState> = _useSelector;
