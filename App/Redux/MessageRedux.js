import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import DataProvider from '../Lib/dataprovider';

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
  error: null,
});

export const getMessages = (offset, cb) => (dispatch) => {
  dataprovider.getMessages(offset)
    .then((list) => {
      console.log(list);
      dispatch(Creators.getMessagesSuccess(list, offset));
      if (cb) { cb(list); }
    })
    .catch(() => {
      dispatch(Creators.messageFailure());
    });
};
/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { params }) =>
  state.merge({ offset: 0 });

// successful api lookup
export const getMessagesSuccess = (state, action) => {
  const { list, offset } = action;
  return state.merge({ list, offset: offset + 5 });
};
// Something went wrong somewhere.
export const getMessagesFailure = state =>
  state.merge({ list: [] });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.MESSAGE_REQUEST]: request,
  [Types.GET_MESSAGES_SUCCESS]: getMessagesSuccess,
  [Types.GET_MESSAGES_FAILURE]: getMessagesFailure,
});
