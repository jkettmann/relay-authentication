import { ROLES as serverRoles } from './server/config'

// eslint-disable-next-line import/prefer-default-export
export const Errors = {
  EmailAlreadyTaken: 'User with email already exists',
  WrongEmailOrPassword: 'Wrong email or password',
}

export const ROLES = serverRoles
