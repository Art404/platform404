import * as types from '../constants/ActionTypes'

export default function layout (state = {sideOpen: false}, action) {
  switch (action.type) {
    case types.TOGGLE_SIDEBAR:
      console.log(action)
      console.log(state)
      return {
        sideOpen: action.sideOpen
      }
    default:
      return state
  }
}

