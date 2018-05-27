import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import DataProvider from '../Lib/dataprovider';
import retryPromise from '../Services/Api';

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


export const getLeadStatus = leadId => new Promise((resolve, reject) => {
  const api = () => (
    dataprovider.getLeadStatus(leadId)
      .then((list) => {
        resolve(list);
      })
      .catch((error) => {
        throw new Error(error);
      })
  );
  retryPromise(api, 'getLeadStatus');
});
export const getProducts = index => new Promise((resolve, reject) => {
  const api = () => (
    dataprovider.getProducts(index)
      .then((list) => {
        resolve(list, index);
      })
      .catch((error) => {
        throw new Error(error);
      })
  );
  retryPromise(api, 'getProducts');
});
export const getLeadStages = () => dispatch => new Promise((resolve, reject) => {
  const api = () => (
    dataprovider.getLeadStages()
      .then((list) => {
        resolve(list);
        dispatch(Creators.getLeadStagesSuccess(list));
      })
      .catch((error) => {
        dispatch(Creators.getLeadStagesFailure());
        throw new Error(error);
      })
  );
  retryPromise(api, 'getLeadStages');
});
export const updateLead = lead => new Promise((resolve, reject) => {
  retryPromise(dataprovider.updateLead(lead)
    .then((res) => {
      resolve(res);
    })
    .catch((error) => {
      throw new Error(error);
    }), 'updateLead');
});
export const createLead = lead => new Promise((resolve, reject) => {
  retryPromise(dataprovider.createLead(lead)
    .then((res) => {
      resolve(res);
    })
    .catch((error) => {
      throw new Error(error);
    }), 'createLead');
});
export const getLostReasons = () => dispatch => new Promise((resolve, reject) => {
  dataprovider.getLostReasons()
    .then((list) => {
      resolve(list);
      dispatch(Creators.getLostReasonsSuccess(list));
    })
    .catch((error) => {
      throw new Error(error);
    }, 'getLostReasons');
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
  const api = () => (
    dataprovider.getLeads()
      .then((list) => {
        if (cb) { cb(list); }
      })
      .catch(() => {
      })
  );
  retryPromise(api, 'getLeads');
};
export const getLead = leadId => new Promise((resolve, reject) => {
  const api = () => (
    dataprovider.getLead(leadId)
      .then((list) => {
        resolve(list);
      })
      .catch((error) => {
        throw new Error(error);
      })
  );
  retryPromise(api, 'getLead');
});
export const getLeadbyStage = stageId => new Promise((resolve, reject) => {
  const api = () => (
    dataprovider.getLeadbyStage(stageId)
      .then((list) => {
        resolve(list);
      })
      .catch((error) => {
        throw new Error(error);
      })
  );
  retryPromise(api, 'getLeadbyStage')
    .then((res) => {
      if (!res) {
        reject(res);
      }
    }).catch((e) => {
      console.log('test', e);
    });
});
export const searchLead = searchTerm => new Promise((resolve, reject) => {
  const api = () => (
    dataprovider.searchLead(searchTerm)
      .then((list) => {
        resolve(list);
      })
      .catch((error) => {
        throw new Error(error);
      })
  );
  retryPromise(api, 'searchLead');
});
export const pipelineCount = () => new Promise((resolve, reject) => {
  const api = () => (
    dataprovider.pipelineCount()
      .then((list) => {
        resolve(list);
      })
      .catch((error) => {
        throw new Error(error);
      })
  );
  retryPromise(api, 'pipelineCount');
});
/* ------------- Reducers ------------- */

// request the data from an api

// successful api lookup
export const getLeadStagesSuccess = (state, action) => {
  const { list } = action;
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
