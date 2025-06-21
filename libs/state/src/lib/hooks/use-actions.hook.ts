import { useDispatch } from 'react-redux';
import { actionCreators } from '../action-creators';
import { bindActionCreators } from '@reduxjs/toolkit';

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actionCreators, dispatch);
};
