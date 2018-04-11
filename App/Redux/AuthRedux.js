import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import DataProvider from '../Lib/dataprovider'
import ReferenceData from '../Data/referencedata'
import {Alert} from 'react-native'
const dataprovider = DataProvider.getInstance()

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginSuccess: ['profile'],
  loginFailure: ['error'],
  getUserInfoSuccess: ['userInfo'],
  getCompanyInfoSuccess: ['companyInfo'],
  getMailChannelsSuccess: ['mailChannels'],
  getCommissionSuccess: ['commission']
})

export const AuthTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  userInfo: {},
  profile: {},
  companyInfo: {},
  isLogin: false,
  error: {}
})

export const login = ({username, password}, cb) => {
  return (dispatch) => {
    dataprovider.login(username, password)
      .then((info) => {
        cb(info)
        dispatch(getUserInfo())
        dispatch(getCompanyInfo(info))
        dispatch(getMailChannels(info))
        dispatch(getCommissionSummary(info))
        dispatch(getCommissionStatus(info.uid))
        dispatch(Creators.loginSuccess(info))
      })
      .catch((error) => {
        dispatch(Creators.loginFailure(error))
        Alert.alert(
          `Login error ${error}`,
          'Username or password are incorrect.',
          [
            { text: 'Retry' }
          ]
        )
      })
  }
}
export const getCommissionSummary = () => {
  console.log(1)
  return (dispatch) => {
    dataprovider.getCommissionSummary()
      .then((data) => {
        const length = data.length
        console.log('getCommissionSummary', data[length-1])
        dispatch(Creators.getCommissionSuccess(data[length-1]))
      })
      .catch((err) => {
        console.log(`error user ${err}`)
      })
  }
}
export const getCommissionStatusDetail = (commissionId, cb) => {
  return (dispatch) => {
    console.log(commissionId)
    dataprovider.getCommissionStatusDetail(commissionId)
      .then((data) => {
        console.log('getCommissionStatusDetail', data)
        // dispatch(Creators.getUserInfoSuccess(data))
      })
      .catch((err) => {
        console.log(`error user ${err}`)
      })
  }
}
export const getCommissionStatus = (userId) => {
  return (dispatch) => {
    console.log(userId)
    dataprovider.getCommissionStatus()
      .then((data) => {
        console.log('getCommissionStatus', data)
        // dispatch(Creators.getUserInfoSuccess(data))
      })
      .catch((err) => {
        console.log(`error user ${err}`)
      })
  }
}
export const getUserInfo = () => {
  return (dispatch) => {
    dataprovider.getUserInfo()
      .then((data) => {
        // console.log('getUserInfo', data)
        dispatch(Creators.getUserInfoSuccess(data))
      })
      .catch((err) => {
        console.log(`error user ${err}`)
      })
  }
}
export const getCompanyInfo = (info) => {
  return (dispatch) => {
    const id = info.id
    dataprovider.getUserInfo(id)
      .then((userInfo) => {
        // console.log('loadCompanyInfo', userInfo)
        ReferenceData.getInstance().setCompanyInfo(userInfo)
        dispatch(Creators.getCompanyInfoSuccess(userInfo))
      })
      .catch((err) => {
        console.log(`error user ${err}`)
      })
  }
}
export const getMailChannels = () => {
  return (dispatch) => {
    dataprovider.getMailChannels()
      .then((mailChannels) => {
        // console.log('mailChannels', mailChannels)
        dispatch(Creators.getMailChannelsSuccess(mailChannels))
      })
      .catch((err) => {
        console.log(`error user ${err}`)
      })
  }
}

/* ------------- Reducers ------------- */
export const loginSuccess = (state, action) => {
  const { profile } = action
  return state.merge({ profile, isLogin: true })
}
export const getUserInfoSuccess = (state, action) => {
  const { userInfo } = action
  return state.merge({ userInfo })
}
export const getCompanyInfoSuccess = (state, action) => {
  const { companyInfo } = action
  return state.merge({ companyInfo })
}
export const getMailChannelsSuccess = (state, action) => {
  const { mailChannels } = action
  return state.merge({ mailChannels })
}
export const getCommissionSuccess = (state, action) => {
  const { commission } = action
  return state.merge({ commission })
}

// Something went wrong somewhere.
export const failure = (state, action) => {
  const { error } = action
  return state.merge({ error })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_SUCCESS]: loginSuccess,
  [Types.LOGIN_FAILURE]: failure,
  [Types.GET_USER_INFO_SUCCESS]: getUserInfoSuccess,
  [Types.GET_COMPANY_INFO_SUCCESS]: getCompanyInfoSuccess,
  [Types.GET_MAIL_CHANNELS_SUCCESS]: getMailChannelsSuccess,
  [Types.GET_COMMISSION_SUCCESS]: getCommissionSuccess

})
