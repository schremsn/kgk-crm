import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import DataProvider from '../Lib/dataprovider';

const dataprovider = DataProvider.getInstance();

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getCommissionSuccess: ['commission'],
});

export const CommissionTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  commission: [],
});

export const getCommissionSummary = month => new Promise((resolve, reject) => {
  dataprovider.getCommissionSummary(month)
    .then((data) => {
      resolve(data, month + 2);
    })
    .catch((err) => {
      reject(err);
    });
});
export const getCommissionStatus = (offset = 0) => new Promise((resolve, reject) => {
  dataprovider.getCommissionStatus(offset)
    .then((list) => {
      const newOffset = offset + 50;
      resolve({ list, newOffset });
    })
    .catch((err) => {
      reject(err);
    });
});

export const getCommissionStatusDetail = commissionId => new Promise((resolve, reject) => {
  dataprovider.getCommissionStatusDetail(commissionId)
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      reject(err);
    });
});

/* ------------- Reducers ------------- */

export const getCommissionSuccess = (state, action) => {
  const { commission } = action;
  return state.merge({ commission });
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_COMMISSION_SUCCESS]: getCommissionSuccess,
});
