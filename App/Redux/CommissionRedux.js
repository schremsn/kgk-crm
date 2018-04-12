import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import DataProvider from '../Lib/dataprovider'
const dataprovider = DataProvider.getInstance()

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getCommissionSuccess: ['commission'],
})

export const CommissionTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  commission: {}
})

export const getCommissionSummary = () => {
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
        cb(data[0])
        console.log('getCommissionStatusDetail', data)
        // dispatch(Creators.getUserInfoSuccess(data))
      })
      .catch((err) => {
        console.log(`error user ${err}`)
      })
  }
}
export const getCommissionStatus = (offset = 0, cb) => {
  return (dispatch, getState) => {
    console.log(dispatch, getState)
    dataprovider.getCommissionStatus(offset)
      .then((data) => {
        cb(data)
        console.log('getCommissionStatus', data)
        // dispatch(Creators.getUserInfoSuccess(data))
      })
      .catch((err) => {
        console.log(`error user ${err}`)
      })
  }
}

/* ------------- Reducers ------------- */

export const getCommissionSuccess = (state, action) => {
  const { commission } = action
  return state.merge({ commission })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_COMMISSION_SUCCESS]: getCommissionSuccess
})
