import cookieSession from 'cookie-session'

import { decodeToken } from '../authentication'

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

const cookieMiddleware = cookieSession({
  name: 'session',
  keys: ['id', 'token'],
})

export default (req, res, next) => {
  cookieMiddleware(req, res, () => getSessionData(req, res, next))
}
