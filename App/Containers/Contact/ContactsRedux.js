import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getContactCategoriesRequest: [null],
  getContactCategoriesSuccess: ['data'],
  getContactCategoriesFailure: ['error'],

  getCustomerRequest: ['offset'],
  getCustomerSuccess: ['data', 'offset'],
  getCustomerFailure: ['error'],

  getCustomerDetailRequest: ['id'],
  getCustomerDetailSuccess: ['data'],
  getCustomerDetailFailure: ['error'],

  createCustomerRequest: ['data'],
  createCustomerSuccess: ['detail'],
  createCustomerFailure: ['error'],

  updateCustomerRequest: ['data'],
  updateCustomerSuccess: ['result'],
  updateCustomerFailure: ['error'],

  createContactAttachmentRequest: ['contactId', 'data', 'fileName', 'description'],
  createContactAttachmentSuccess: ['detail'],
  createContactAttachmentFailure: ['error'],

  searchCustomerRequest: ['searchTerm'],
  searchCustomerSuccess: ['data'],
  searchCustomerFailure: ['error'],
});

export const ContactTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  customerList: [],
  customerDetail: null,
  categoryList: [],
  fetchingList: false,
  fetchingDetail: false,
  fetchingCreate: false,
  fetchingUpdate: false,
  fetchingCategory: false,
  fetchingAttachment: false,
  offset: 0,
});

/* ------------- Reducers ------------- */

export const getContactCategoriesRequest = state => state.merge({ fetchingCategory: true });
export const getContactCategoriesSuccess = (state, { data }) => state.merge({ fetchingCategory: false, categoryList: data });
export const getContactCategoriesFailure = (state, { errors }) => state.merge({ fetchingCategory: false, errors });


export const getCustomerRequest = (state, { offset} ) => state.merge({ fetchingList: true, customerList: offset === 0 ? [] : state.customerList });
export const getCustomerSuccess = (state, { data, offset }) => state.merge({ fetchingList: false, customerList: data, offset: offset + 15 });
export const getCustomerFailure = (state, { errors }) => state.merge({ fetchingList: false, errors });

export const searchCustomerRequest = state => state.merge({ fetchingList: true });
export const searchCustomerSuccess = (state, { data }) => state.merge({ fetchingList: false, customerList: data });
export const searchCustomerFailure = (state, { errors }) => state.merge({ fetchingList: false, errors });

// get_customer_detail

export const getCustomerDetailRequest = state => state.merge({ fetchingDetail: true });
export const getCustomerDetailSuccess = (state, { data }) => state.merge({ fetchingDetail: false, customerDetail: data });
export const getCustomerDetailFailure = (state, { errors }) => state.merge({ fetchingDetail: false, errors });

// create_customer

export const createCustomerRequest = state => state.merge({ fetchingCreate: true });
export const createCustomerSuccess = state => state.merge({ fetchingCreate: false });
export const createCustomerFailure = (state, { errors }) => state.merge({ fetchingCreate: false, errors });

// update_customer

export const updateCustomerRequest = state => state.merge({ fetchingUpdate: true });
export const updateCustomerSuccess = state => state.merge({ fetchingUpdate: false });
export const updateCustomerFailure = (state, { errors }) => state.merge({ fetchingUpdate: false, errors });

export const createContactAttachmentRequest = state => state.merge({ fetchingAttachment: true });
export const createContactAttachmentSuccess = state => state.merge({ fetchingAttachment: false });
export const createContactAttachmentFailure = (state, { errors }) => state.merge({ fetchingAttachment: false, errors });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {

  [Types.GET_CUSTOMER_REQUEST]: getCustomerRequest,
  [Types.GET_CUSTOMER_SUCCESS]: getCustomerSuccess,
  [Types.GET_CUSTOMER_FAILURE]: getCustomerFailure,

  [Types.GET_CUSTOMER_DETAIL_REQUEST]: getCustomerDetailRequest,
  [Types.GET_CUSTOMER_DETAIL_SUCCESS]: getCustomerDetailSuccess,
  [Types.GET_CUSTOMER_DETAIL_FAILURE]: getCustomerDetailFailure,

  [Types.CREATE_CUSTOMER_REQUEST]: createCustomerRequest,
  [Types.CREATE_CUSTOMER_SUCCESS]: createCustomerSuccess,
  [Types.CREATE_CUSTOMER_FAILURE]: createCustomerFailure,

  [Types.UPDATE_CUSTOMER_REQUEST]: updateCustomerRequest,
  [Types.UPDATE_CUSTOMER_SUCCESS]: updateCustomerSuccess,
  [Types.UPDATE_CUSTOMER_FAILURE]: updateCustomerFailure,

  [Types.SEARCH_CUSTOMER_REQUEST]: searchCustomerRequest,
  [Types.SEARCH_CUSTOMER_SUCCESS]: searchCustomerSuccess,
  [Types.SEARCH_CUSTOMER_FAILURE]: searchCustomerFailure,

  [Types.GET_CONTACT_CATEGORIES_REQUEST]: getContactCategoriesRequest,
  [Types.GET_CONTACT_CATEGORIES_SUCCESS]: getContactCategoriesSuccess,
  [Types.GET_CONTACT_CATEGORIES_FAILURE]: getContactCategoriesFailure,

  [Types.CREATE_CONTACT_ATTACHMENT_REQUEST]: createContactAttachmentRequest,
  [Types.CREATE_CONTACT_ATTACHMENT_SUCCESS]: createContactAttachmentSuccess,
  [Types.CREATE_CONTACT_ATTACHMENT_FAILURE]: createContactAttachmentFailure,
});
