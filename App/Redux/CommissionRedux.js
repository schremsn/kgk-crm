import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import DataProvider from '../Lib/dataprovider';
import retryPromise from '../Services/Api';

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


export const getCommissionSummary = (month = 2) => new Promise((resolve, reject) => {
  const requestApi = () => (
    dataprovider.getCommissionSummary(month)
      .then((data) => {
        console.log(data);
        resolve(data);
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      })
  );
  retryPromise(requestApi, reject, 'getCommissionSummary');
});

export const getCommissionStatus = (offset = 0) => new Promise((resolve, reject) => {
  const requestApi = () => (
    dataprovider.getCommissionStatus(offset)
      .then((list) => {
        const newOffset = offset + 50;
        resolve({ list, newOffset });
      })
      .catch((err) => {
        throw new Error(err);
      })
  );
  retryPromise(requestApi, reject, 'getCommissionStatus');
});

export const getCommissionStatusDetail = commissionId => new Promise((resolve, reject) => {
  const requestApi = () => {
    dataprovider.getCommissionStatusDetail(commissionId)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };
  retryPromise(requestApi, reject, 'getCommissionStatusDetail');
});

/* ------------- Reducers ------------- */

export const getCommissionSuccess = (state, action) => {
  const { commission } = action;
  return state.merge({ commission });
};


/* ------------- Hookup ReduceissionSuccess = (
 } = action;
({ commission });rs To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_COMMISSION_SUCCESS]: getCommissionSuccess,
});
