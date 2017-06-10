import jwt from 'jsonwebtoken'

import { SECRET, ROLES } from './config'

export function createToken({ id, role } = {}) {
  // eslint-disable-next-line no-undef
  log(`create token with user id ${id}`)
  return id && role && jwt.sign({ userId: id, role }, SECRET)
}

export function decodeToken(token) {
  return jwt.verify(token, SECRET)
}

export function isLoggedIn({ role }) {
  return !!Object.values(ROLES).find(existingRole => existingRole === role)
}

export function canPublish({ role }) {
  return role === ROLES.publisher || role === ROLES.admin
}
