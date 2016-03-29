import jwt from 'jsonwebtoken';

import {secret} from './config';
import {ROLES} from '../config';

export const ANONYMOUS_TOKEN_DATA = {role: ROLES.anonymous, userId: 'anonymous'};

export function createAnonymousToken () {
  return createToken();
}

export function createToken (userData) {
  if (userData && userData.userId) {
    const {userId, role} = userData;
    log('create token with userId ' + userId);
    return jwt.sign({userId, role}, secret);
  }
  else {
    return jwt.sign(ANONYMOUS_TOKEN_DATA, secret);
  }
}

export function decodeToken (token) {
  return jwt.verify(token, secret);
}

export function hasAuthorization (actualRole, expectedRole, next) {
  if (actualRole === expectedRole) {
    return next();
  }
  else {
    return () => null;
  }
}