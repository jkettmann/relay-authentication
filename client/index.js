// eslint-disable-next-line import/no-extraneous-dependencies
import 'babel-polyfill'
import 'whatwg-fetch'

import React from 'react'
import ReactDOM from 'react-dom'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import BrowserProtocol from 'farce/lib/BrowserProtocol'
import queryMiddleware from 'farce/lib/queryMiddleware'
import createFarceRouter from 'found/lib/createFarceRouter'
import createRender from 'found/lib/createRender'
import { Resolver } from 'found-relay'
import injectTapEventPlugin from 'react-tap-event-plugin'

import routes from './common/components/Routes'

import './common/base.css'

injectTapEventPlugin()

function fetchQuery(operation, variables, cacheConfig, uploadables) {
  let body
  let headers

  if (uploadables) {
    // eslint-disable-next-line no-undef
    body = new FormData()
    body.append('query', operation.text)
    body.append('variables', JSON.stringify(variables))
    Object.keys(uploadables).forEach(filename => {
      // eslint-disable-next-line no-prototype-builtins
      if (uploadables.hasOwnProperty(filename)) {
        body.append(filename, uploadables[filename])
      }
    })
  } else {
    body = JSON.stringify({
      query: operation.text,
      variables,
    })
    headers = {
      Accept: '*/*',
      'Content-Type': 'application/json',
    }
  }

  // eslint-disable-next-line no-undef
  return fetch('/graphql', {
    method: 'POST',
    credentials: 'same-origin',
    headers,
    body,
  }).then(response => response.json())
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
})

const Router = createFarceRouter({
  historyProtocol: new BrowserProtocol(),
  historyMiddlewares: [queryMiddleware],
  routeConfig: routes,
  render: createRender({}),
})

ReactDOM.render(
  <Router resolver={new Resolver(environment)} />,
  // eslint-disable-next-line no-undef
  document.getElementById('app'),
)
