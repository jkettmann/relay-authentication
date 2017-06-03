// eslint-disable-next-line import/no-extraneous-dependencies
import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay'
import useRelay from 'react-router-relay'
import { applyRouterMiddleware, Router, browserHistory } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin'

import Routes from './common/components/Routes'

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

ReactDOM.render(
  <Router
    history={browserHistory}
    routes={Routes}
    render={applyRouterMiddleware(useRelay)}
    environment={Relay.Store}
  />,
  // eslint-disable-next-line no-undef
  document.getElementById('app'),
)
