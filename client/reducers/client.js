import * as types from '../constants/ActionTypes'

export default function client (state = {}, action) {
  switch (action.type) {
    case types.SET_CLIENT:
      return action.client
    default:
      return state
  }
}

