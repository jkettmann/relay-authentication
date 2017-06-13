import express from 'express'
import graphQLHTTP from 'express-graphql'
import cookieSession from 'cookie-session'

import uploadMiddleWare from './uploadMiddleware'
import { decodeToken } from './authentication'
import Schema from './graphql/schema'

function loadSessionData(req) {
  if (req.session && req.session.token) {
    return new Promise((resolve) => {
      let tokenData = null
      try {
        tokenData = decodeToken(req.session.token)
      } catch (err) {
        // eslint-disable-next-line no-undef
        log(err)
      }
      resolve(tokenData)
    })
  }

  return new Promise((resolve) => {
    resolve(null)
  })
}

function getSessionData(req, res, next) {
  loadSessionData(req)
    .then((tokenData) => {
      req.tokenData = tokenData || {}
      next()
    })
    .catch(() => {
      res.sendStatus(400)
    })
}

export default function createGraphQlServer(port, database) {
  const graphQLServer = express()

  graphQLServer.use(
    cookieSession({
      name: 'session',
      keys: ['id', 'token'],
    }),
  )

  graphQLServer.use('/graphql', uploadMiddleWare)

  graphQLServer.use(
    '/graphql',
    getSessionData,
    graphQLHTTP(({ session, tokenData }) => ({
      graphiql: true,
      pretty: true,
      schema: Schema,
      context: { db: database },
      rootValue: { session, tokenData },
    })),
  )

  return graphQLServer.listen(port, () =>
    // eslint-disable-next-line no-undef
    log(`GraphQL Server is now running on http://localhost:${port}`),
  )
}
