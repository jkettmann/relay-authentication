import jwt from 'jsonwebtoken'

import { secret } from './config'

export function createToken({ id, role }) {
  // eslint-disable-next-line no-undef
  log(`create token with user id ${id}`)
  return jwt.sign({ userId: id, role }, secret)
}

export function decodeToken(token) {
  return jwt.verify(token, secret)
}

export function hasAuthorization(actualRole, expectedRole, next) {
  if (actualRole === expectedRole) {
    return next()
  }

  return () => null
}
