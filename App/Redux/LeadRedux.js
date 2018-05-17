import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import DataProvider from '../Lib/dataprovider';

const dataprovider = DataProvider.getInstance();

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getLeadStagesSuccess: ['list'],
  getLostReasonsSuccess: ['listReasonLost'],
  getLeadStagesFailure: null,
});

export const MessageTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  list: [],
  offset: 0,
  error: null,
  listReasonLost: [],
});


export const getProducts = (index) => new Promise((resolve, reject) => {
  dataprovider.getProducts(index)
    .then((list) => {
      resolve(list, index);
    })
    .catch((error) => {
      reject(error);
    });
});
export const getLeadStages = () => dispatch => new Promise((resolve, reject) => {
  dataprovider.getLeadStages()
    .then((list) => {
      resolve(list);
      dispatch(Creators.getLeadStagesSuccess(list));
    })
    .catch((error) => {
      reject(error);
      dispatch(Creators.getLeadStagesFailure());
    });
});
export const updateLead = lead => new Promise((resolve, reject) => {
  dataprovider.updateLead(lead)
    .then((res) => {
      resolve(res);
    })
    .catch((error) => {
      reject(error);
    });
});
export const createLead = lead => new Promise((resolve, reject) => {
  dataprovider.createLead(lead)
    .then((res) => {
      resolve(res);
    })
    .catch((error) => {
      reject(error);
    });
});
export const getLostReasons = () => dispatch => new Promise((resolve, reject) => {
  dataprovider.getLostReasons()
    .then((list) => {
      resolve(list);
      console.log('getLostReasonsSuccess', list);
      dispatch(Creators.getLostReasonsSuccess(list));
    })
    .catch((error) => {
      reject(error);
    });
});
export const markLeadWon = lead => new Promise((resolve, reject) => {
  dataprovider.markLeadWon(lead)
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    });
});
export const markLeadLost = lead => new Promise((resolve, reject) => {
  console.log(lead);
  dataprovider.markLeadLost(lead)
    .then((res) => {
      console.log(res);
      resolve(res);
    })
    .catch((err) => {
      console.log(err);
      reject(err);
    });
});
export const getLeads = cb => (dispatch) => {
  dataprovider.getLeads()
    .then((list) => {
      console.log('get leads', list);
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
      console.log('get lead by id', list);
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
      console.log('get lead by stage', list);
      if (cb) { cb(list); }
    })
    .catch(() => {
      dispatch(Creators.getLeadStagesFailure());
    });
};
export const searchLead = (searchTerm, cb) => (dispatch) => {
  dataprovider.searchLead(searchTerm)
    .then((list) => {
      console.log('search leads', list);
      // dispatch(Creators.getLeadStagesSuccess(list));
      if (cb) { cb(list); }
    })
    .catch(() => {
      // dispatch(Creators.getLeadStagesFailure());
    });
};
export const pipelineCount = cb => (dispatch) => {
  dataprovider.pipelineCount()
    .then((list) => {
      console.log(list);
      // dispatch(Creators.getLeadStagesSuccess(list));
      if (cb) {
        console.log(1);
        cb(list);
      }
    })
    .catch(() => {
      // dispatch(Creators.getLeadStagesFailure());
    });
};
/* ------------- Reducers ------------- */

// request the data from an api

// successful api lookup
export const getLeadStagesSuccess = (state, action) => {
  const { list } = action;
  console.log(list);
  return state.merge({ list });
};
export const getLostReasonsSuccess = (state, action) => {
  const { listReasonLost } = action;
  return state.merge({ listReasonLost });
};
// Something went wrong somewhere.
export const getLeadStagesFailure = state =>
  state.merge({ list: [] });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_LEAD_STAGES_SUCCESS]: getLeadStagesSuccess,
  [Types.GET_LEAD_STAGES_FAILURE]: getLeadStagesFailure,
  [Types.GET_LOST_REASONS_SUCCESS]: getLostReasonsSuccess,
});
