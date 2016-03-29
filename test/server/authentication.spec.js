import jwt from 'jsonwebtoken';

import {secret, ROLES} from '../../config';
import {createToken} from '../../server/authentication';

describe('Authentication', () => {

  it('creates a token for a registered user', () => {
    const userData = {
      userId: 'id1',
      role: 'reader'
    };

    const token = createToken(userData);
    expect(token).to.be.ok;

    const payload = jwt.decode(token, secret);
    const expectedPayload = {iat: payload.iat, ...userData};
    expect(payload).to.deep.equal(expectedPayload);
  });

  it('creates a token for an anonymous user if user id is not given', () => {
    const userData = {
      name: 'name1',
      role: 'reader',
    };

    const token = createToken(userData);
    expect(token).to.be.ok;

    const payload = jwt.decode(token, secret);
    const expectedPayload = {iat: payload.iat, role: ROLES.anonymous, userId: 'anonymous'};
    expect(payload).to.deep.equal(expectedPayload);
  });

  it('creates a token for an anonymous user if no user data is given', () => {
    const token = createToken(undefined);
    expect(token).to.be.ok;

    const payload = jwt.decode(token, secret);
    const expectedPayload = {iat: payload.iat, role: ROLES.anonymous, userId: 'anonymous'};
    expect(payload).to.deep.equal(expectedPayload);
  });

});