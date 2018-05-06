import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import DataProvider from '../Lib/dataprovider';
import ReferenceData from '../Data/referencedata';
import { Alert } from 'react-native';
import { getCommissionStatus } from './CommissionRedux';
import { getLeadStages } from './LeadRedux';

const dataprovider = DataProvider.getInstance();

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginSuccess: ['profile'],
  loginFailure: ['error'],
  getUserInfoSuccess: ['userInfo'],
  getCompanyInfoSuccess: ['companyInfo'],
  getMailChannelsSuccess: ['mailChannels'],
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
  error: {},
});

export const getUserInfo = () => (dispatch) => {
  dataprovider.getUserInfo()
    .then((data) => {
      // console.log('getUserInfo', data)
      dispatch(Creators.getUserInfoSuccess(data));
      ReferenceData.getInstance().setCompanyInfo(data.id);
      dispatch(Creators.getCompanyInfoSuccess(data));
    })
    .catch((err) => {
      console.log(`error user ${err}`);
    });
};
export const getMailChannels = () => (dispatch) => {
  dataprovider.getMailChannels()
    .then((mailChannels) => {
      // console.log('mailChannels', mailChannels)
      dispatch(Creators.getMailChannelsSuccess(mailChannels));
    })
    .catch((err) => {
      console.log(`error user ${err}`);
    });
};

export const login = ({ username, password }, cb) => (dispatch) => {
  dataprovider.login(username, password)
    .then((info) => {
      cb(info);
      dispatch(getUserInfo());
      dispatch(getMailChannels(info));
      dispatch(getCommissionStatus(info.uid));
      dispatch(Creators.loginSuccess(info));
    })
    .catch((error) => {
      dispatch(Creators.loginFailure(error));
      Alert.alert(
        `Login error ${error}`,
        'Username or password are incorrect.',
        [
          { text: 'Retry' },
        ],
      );
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

});
