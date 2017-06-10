/* eslint-disable no-undef, no-unused-expressions */
import jwt from 'jsonwebtoken'

import { SECRET } from '../config'
import { createToken } from '../authentication'

describe('Authentication', () => {
  it('creates a token for a registered user', () => {
    const userData = {
      id: '1',
      role: 'reader',
    }

    const token = createToken(userData)
    expect(token).to.be.ok

    const payload = jwt.decode(token, SECRET)
    const expectedPayload = { iat: payload.iat, userId: '1', role: 'reader' }
    expect(payload).to.deep.equal(expectedPayload)
  })

  it('creates no token if user id is not given', () => {
    const userData = {
      name: 'name1',
      role: 'reader',
    }

    const token = createToken(userData)
    expect(token).to.be.not.ok
  })

  it('creates no token if no user data is given', () => {
    const token = createToken(undefined)
    expect(token).to.be.not.ok
  })
})
/* eslint-enable no-undef, no-unused-expressions */
