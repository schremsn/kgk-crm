import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import DataProvider from '../Lib/dataprovider';
import retryPromise from '../Services/Api';

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

export const createCustomer = data => new Promise((resolve, reject) => {
  const requestApi = () => (
    dataprovider.createCustomer(data)
      .then((detail) => {
        resolve(detail);
      })
      .catch((err) => {
        throw new Error(err);
      })
  );
  retryPromise(requestApi, 'createCustomer');
});
export const updateCustomer = data => new Promise((resolve, reject) => {
  const requestApi = () => (
    dataprovider.updateCustomer(data)
      .then((detail) => {
        resolve(detail);
      })
      .catch((err) => {
        throw new Error(err);
      })
  );
  retryPromise(requestApi, 'createCustomer');
});
export const getCustomers = (offset = 0) => new Promise((resolve, reject) => {
  const requestApi = () => (
    dataprovider.getCustomers(offset)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        throw new Error(err);
      })
  );
  retryPromise(requestApi, 'getCustomers');
});
export const getCustomerDetail = id => new Promise((resolve, reject) => {
  const requestApi = () => (
    dataprovider.getCustomerDetail(id)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        throw new Error(err);
      })
  );
  retryPromise(requestApi, 'getCustomerDetail');
});
export const searchCustomer = searchTerm => new Promise((resolve, reject) => {
  const requestApi = () => (
    dataprovider.searchCustomer(searchTerm)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
  );
  retryPromise(requestApi, 'searchCustomer');
});

/* ------------- Reducers ------------- */

export const getContactsSuccess = (state, action) => {
  const { list, offset } = action;
  return state.merge({ list, offset: offset + 5 });
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_CONTACTS_SUCCESS]: getContactsSuccess,
});
