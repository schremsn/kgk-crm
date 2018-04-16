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
  commission: {},
});

export const getCommissionSummary = () => (dispatch) => {
  dataprovider.getCommissionSummary()
    .then((data) => {
      const lengthData = data.length;
      console.log('getCommissionSummary', data[lengthData - 1]);
      dispatch(Creators.getCommissionSuccess(data[lengthData - 1]));
    })
    .catch((err) => {
      console.log(`error user ${err}`);
    });
};
export const getCommissionStatusDetail = (commissionId, cb) => () => {
  dataprovider.getCommissionStatusDetail(commissionId)
    .then((data) => {
      cb(data[0]);
      console.log('getCommissionStatusDetail', data);
      // dispatch(Creators.getUserInfoSuccess(data))
    })
    .catch((err) => {
      console.log(`error user ${err}`);
    });
};
export const getCommissionStatus = (offset = 0, cb) => (dispatch, getState) => {
  console.log(dispatch, getState);
  dataprovider.getCommissionStatus(offset)
    .then((data) => {
      cb(data);
      console.log('getCommissionStatus', data);
      // dispatch(Creators.getUserInfoSuccess(data))
    })
    .catch((err) => {
      console.log(`error user ${err}`);
    });
};

/* ------------- Reducers ------------- */

export const getCommissionSuccess = (state, action) => {
  const { commission } = action;
  return state.merge({ commission });
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_COMMISSION_SUCCESS]: getCommissionSuccess,
});
