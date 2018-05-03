import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import DataProvider from '../Lib/dataprovider';

const dataprovider = DataProvider.getInstance();

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  messageRequest: ['data'],
  getLeadStagesSuccess: ['list'],
  getLeadStagesFailure: null,
});

export const MessageTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  list: [],
  offset: 0,
  error: null,
});

export const getLeadStages = (cb) => (dispatch) => {
  dataprovider.getLeadStages()
    .then((list) => {
      console.log(list)
      dispatch(Creators.getLeadStagesSuccess(list));
      if (cb) { cb(list); }
    })
    .catch(() => {
      dispatch(Creators.getLeadStagesFailure());
    });
};
export const getLeads = (cb) => (dispatch) => {
  dataprovider.getLeads()
    .then((list) => {
      console.log('get leads', list)
      // dispatch(Creators.getLeadStagesSuccess(list));
      if (cb) { cb(list); }
    })
    .catch(() => {
      // dispatch(Creators.getLeadStagesFailure());
    });
};
export const getLead = (leadId, cb) => (dispatch) => {
  dataprovider.getLead(leadId)
    .then((list) => {
      console.log('get lead by id', list)
      // dispatch(Creators.getLeadStagesSuccess(list));
      if (cb) { cb(list); }
    })
    .catch(() => {
      // dispatch(Creators.getLeadStagesFailure());
    });
};
export const getLeadbyStage = (stageid, cb) => (dispatch) => {
  dataprovider.getLeadbyStage(stageid)
    .then((list) => {
      console.log('get lead by stage', list)
      // dispatch(Creators.getLeadStagesSuccess(list));
      if (cb) { cb(list); }
    })
    .catch(() => {
      // dispatch(Creators.getLeadStagesFailure());
    });
};
export const searchLead = (searchTerm, cb) => (dispatch) => {
  dataprovider.searchLead(searchTerm)
    .then((list) => {
      console.log('search leads', list)
      // dispatch(Creators.getLeadStagesSuccess(list));
      if (cb) { cb(list); }
    })
    .catch(() => {
      // dispatch(Creators.getLeadStagesFailure());
    });
};
export const pipelineCount = (cb) => (dispatch) => {
  dataprovider.pipelineCount()
    .then((list) => {
      console.log(list)
      // dispatch(Creators.getLeadStagesSuccess(list));
      if (cb) { cb(list); }
    })
    .catch(() => {
      // dispatch(Creators.getLeadStagesFailure());
    });
};
/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { params }) =>
  state.merge({ offset: 0 });

// successful api lookup
export const getLeadStagesSuccess = (state, action) => {
  const { list } = action;
  return state.merge({ list });
};
// Something went wrong somewhere.
export const getLeadStagesFailure = state =>
  state.merge({ list: [] });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.MESSAGE_REQUEST]: request,
  [Types.GET_LEAD_STAGES_SUCCESS]: getLeadStagesSuccess,
  [Types.GET_LEAD_STAGES_FAILURE]: getLeadStagesFailure,
});
