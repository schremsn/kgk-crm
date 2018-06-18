import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import DataProvider from '../Lib/dataprovider';
import retryPromise from '../Services/Api';

const dataprovider = DataProvider.getInstance();

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  productRequest: null,
  productSuccess: ['list', 'offset'],
  productFailure: null,
  updateParams: ['params'],
});

export const ProductTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  list: [],
  offset: 0,
  error: null,
});

export const initState = () => (dispatch) => {
  dispatch(Creators.productRequest());
};

export const getProducts = (offset, cb) => new Promise((resolve, reject) => {
  const requestApi = () => (
    dataprovider.getProducts(offset)
      .then((list) => {
        resolve(list, offset + 50);
      })
      .catch((error) => {
        throw new Error(error);
      })
  );
  retryPromise(requestApi, reject, 'getProducts');
});
export const getProductDetail = productId => new Promise((resolve, reject) => {
  const requestApi = () => (
    dataprovider.getProductDetail(productId)
      .then((detail) => {
        resolve(detail[0]);
      })
      .catch((err) => {
        throw new Error(err);
      })
  );
  retryPromise(requestApi, 'getProductDetail');
});


/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { params }) =>
  state.merge({ offset: 0 });

// successful api lookup
export const success = (state, action) => {
  const { list, offset } = action;
  return state.merge({ list, offset: offset + 5 });
};

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ list: [] });

export const update = (state, { params }) =>
  state.merge({ params });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PRODUCT_REQUEST]: request,
  [Types.PRODUCT_SUCCESS]: success,
  [Types.PRODUCT_FAILURE]: failure,
  [Types.UPDATE_PARAMS]: update,
});
