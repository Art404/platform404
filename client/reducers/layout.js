import * as types from '../constants/ActionTypes'

export default function layout (state = {sideOpen: false}, action) {
  switch (action.type) {
    case types.TOGGLE_SIDEBAR:
      return {
        sideOpen: action.sideOpen
      }
    default:
      return state
  }
}

