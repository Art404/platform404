import {combineReducers} from 'redux'
import app from './app'
import layout from './layout'
import client from './client'

export default combineReducers({
  app,
  client,
  layout
})
