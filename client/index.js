// eslint-disable-next-line import/no-extraneous-dependencies
import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay/classic'
import BrowserProtocol from 'farce/lib/BrowserProtocol'
import queryMiddleware from 'farce/lib/queryMiddleware'
import createFarceRouter from 'found/lib/createFarceRouter'
import createRender from 'found/lib/createRender'
import { Resolver } from 'found-relay/lib/classic'
import injectTapEventPlugin from 'react-tap-event-plugin'

import routes from './common/components/Routes'

import './common/base.css'

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    credentials: 'same-origin',
  }),
)

const Router = createFarceRouter({
  historyProtocol: new BrowserProtocol(),
  historyMiddlewares: [queryMiddleware],
  routeConfig: routes,
  render: createRender({}),
})

ReactDOM.render(
  <Router resolver={new Resolver(Relay.Store)} />,
  // eslint-disable-next-line no-undef
  document.getElementById('app'),
)
