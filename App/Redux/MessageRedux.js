import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import DataProvider from '../Lib/dataprovider';
import retryPromise from '../Services/Api';

const dataprovider = DataProvider.getInstance();

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  messageRequest: ['data'],
  getMessagesSuccess: ['list', 'offset'],
  getMessagesFailure: null,
});

export const MessageTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  list: [],
  offset: 0,
  error: false,
  fetching: true,
});

export const getMessages = offset => new Promise((resolve, reject) => {
  const api = () => (
    dataprovider.getMessages(offset)
      .then((list) => {
        resolve(list, offset + 50);
      })
      .catch((error) => {
        throw new Error(error);
      })
  );
  retryPromise(api, reject, 'getMessages');
});
/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { params }) =>
  state.merge({ offset: 0 });

// successful api lookup
export const getMessagesSuccess = (state, action) => {
  const { list, offset } = action;
  return state.merge({ list, offset: offset + 50 });
};
// Something went wrong somewhere.
export const getMessagesFailure = state =>
  state.merge({ list: [], fetching: false, error: true });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.MESSAGE_REQUEST]: request,
  [Types.GET_MESSAGES_SUCCESS]: getMessagesSuccess,
  [Types.GET_MESSAGES_FAILURE]: getMessagesFailure,
});
