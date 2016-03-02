import * as types from '../constants/ActionTypes'

export default function app (state = {}, action) {
  switch (action.type) {
    case types.FETCH_FIRE_SUCCESS:
      return action.fire
    default:
      return state
  }
}
