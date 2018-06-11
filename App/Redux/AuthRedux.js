import { Alert } from 'react-native';
import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
// libraries
import * as Keychain from 'react-native-keychain';

// services
import DataProvider from '../Lib/dataprovider';
import ReferenceData from '../Data/referencedata';
import { getLostReasons } from './LeadRedux';
import retryPromise from '../Services/Api';

const dataprovider = DataProvider.getInstance();

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginSuccess: ['profile'],
  loginFailure: ['error'],
  getUserInfoSuccess: ['userInfo'],
  getCompanyInfoSuccess: ['companyInfo'],
  getMailChannelsSuccess: ['mailChannels'],
  getStatesSuccess: ['states'],
});

export const AuthTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  userInfo: {},
  profile: {},
  companyInfo: {},
  mailChannels: [],
  isLogin: false,
  states: [],
  error: {},
});

export const getUserInfo = () => (dispatch) => {
  const requestApi = () => (
    dataprovider.getUserInfo()
      .then((data) => {
        dispatch(Creators.getUserInfoSuccess(data));
        ReferenceData.getInstance().setCompanyInfo(data.id);
        // dispatch(Creators.getCompanyInfoSuccess(data));
      })
      .catch((err) => {
        throw new Error(err);
      })
  );
  retryPromise(requestApi, null, 'getUserInfo');
};

const getStates = (countryId, dispatch) => {
  const requestApi = () => (
    dataprovider.getStates(countryId)
      .then((res) => {
        dispatch(Creators.getStatesSuccess(res));
      })
      .catch((err) => {
        throw new Error(err);
      })
  );
  retryPromise(requestApi, null, 'getStates');
};
export const getCompanyInfo = id => (dispatch) => {
  const requestApi = () => (
    dataprovider.getCompanyInfo(id)
      .then((data) => {
        getStates(data.country_id, dispatch);
      })
      .catch((err) => {
        throw new Error(err);
      })
  );
  retryPromise(requestApi, null, 'getCompanyInfo');
};
export const getMailChannels = () => (dispatch) => {
  const requestApi = () => (
    dataprovider.getMailChannels()
      .then((mailChannels) => {
      // console.log('mailChannels', mailChannels)
        dispatch(Creators.getMailChannelsSuccess(mailChannels));
      })
      .catch((err) => {
        throw new Error(err);
      })
  );
  retryPromise(requestApi, null, 'getMailChannels');
};

export const login = ({ username, password, isRemember }, cb) => async (dispatch) => {
  console.log(username, password, isRemember);
  if (isRemember) {
    await Keychain.setGenericPassword(username, password);
    dataprovider.login(username, password)
      .then((info) => {
        cb(info);
        dispatch(getUserInfo());
        dispatch(getCompanyInfo(info.company_id));
        dispatch(getMailChannels(info));
        dispatch(getLostReasons());
        dispatch(Creators.loginSuccess(info));
      })
      .catch((error) => {
        cb(false, error);
        dispatch(Creators.loginFailure(error));
      });
  } else {
    dataprovider.login(username, password)
      .then((info) => {
        cb(info);
        dispatch(getUserInfo());
        dispatch(getCompanyInfo(info.company_id));
        dispatch(getMailChannels(info));
        dispatch(getLostReasons());
        dispatch(Creators.loginSuccess(info));
      })
      .catch((error) => {
        dispatch(Creators.loginFailure(error));
        cb(false, error);
      });
  }
};
export const checkLogin = ({ username, password }, cb) => (dispatch) => {
  dataprovider.login(username, password)
    .then((info) => {
      cb(info);
      dispatch(getUserInfo());
      dispatch(getCompanyInfo(info.company_id));
      dispatch(getMailChannels(info));
      dispatch(getLostReasons());
      dispatch(Creators.loginSuccess(info));
    })
    .catch((error) => {
      dispatch(Creators.loginFailure(error));
      cb(false, error);
    });
};
/* ------------- Reducers ------------- */
export const loginSuccess = (state, action) => {
  const { profile } = action;
  return state.merge({ profile, isLogin: true });
};
export const getUserInfoSuccess = (state, action) => {
  const { userInfo } = action;
  return state.merge({ userInfo });
};
export const getCompanyInfoSuccess = (state, action) => {
  const { companyInfo } = action;
  return state.merge({ companyInfo });
};
export const getMailChannelsSuccess = (state, action) => {
  const { mailChannels } = action;
  return state.merge({ mailChannels });
};
export const getStatesSuccess = (state, action) => {
  const { states } = action;
  return state.merge({ states });
};

// Something went wrong somewhere.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({ error });
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_SUCCESS]: loginSuccess,
  [Types.LOGIN_FAILURE]: failure,
  [Types.GET_USER_INFO_SUCCESS]: getUserInfoSuccess,
  [Types.GET_COMPANY_INFO_SUCCESS]: getCompanyInfoSuccess,
  [Types.GET_MAIL_CHANNELS_SUCCESS]: getMailChannelsSuccess,
  [Types.GET_STATES_SUCCESS]: getStatesSuccess,
});
