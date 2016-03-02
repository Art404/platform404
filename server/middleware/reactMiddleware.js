import {RouterContext, match} from 'react-router'
import {Provider} from 'react-redux'
import React from 'react'
import configureStore from '../../client/store/configureStore'
import createLocation from 'history/lib/createLocation'
import {fetchFire} from '../../client/actions/AppActions'
import {renderToString} from 'react-dom/server'
import routes from '../../client/routes'

export default function reactMiddleware (req, res) {
  global.ua = req.headers['user-agent']
  const location = createLocation(req.url)

  match({routes, location}, (error, redirectLocation, renderProps) => {
    if (error) return res.status(500).send(error.message)
    if (redirectLocation) return res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    if (!renderProps) return res.status(404).send('Not Found')

    const assets = require('../../build/assets.json')
    const store = configureStore()

    return store.dispatch(fetchFire()).then(() => {
      const initialState = JSON.stringify(store.getState())
      const content = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      )

      return res.render('index', {content, assets, initialState})
    })
  })
}
