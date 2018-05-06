import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import DataProvider from '../Lib/dataprovider';

const dataprovider = DataProvider.getInstance();

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getContactsSuccess: ['list', 'offset'],

});

export const CommissionTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  list: [],
  offset: 0,
});

export const getCustomers = (offset = 0, cb) => (dispatch, getState) => {
  dataprovider.getCustomers(offset)
    .then((data) => {
      cb(data);
      console.log('getCustomers', data);
      // dispatch(Creators.getUserInfoSuccess(data))
    })
    .catch((err) => {
      console.log(`error user ${err}`);
    });
};export const searchCustomer = (searchTerm, cb) => (dispatch, getState) => {
  dataprovider.searchCustomer(searchTerm)
    .then((data) => {
      cb(data);
      console.log('searchCustomer', data);
      // dispatch(Creators.getUserInfoSuccess(data))
    })
    .catch((err) => {
      console.log(`error user ${err}`);
    });
};

/* ------------- Reducers ------------- */

export const getContactsSuccess = (state, action) => {
  const { list, offset } = action;
  return state.merge({ list, offset: offset + 5 });
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_CONTACTS_SUCCESS]: getContactsSuccess,
});
