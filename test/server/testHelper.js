// ---------------------------------------
// Test Environment Setup
// ---------------------------------------
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import request from 'supertest';
import {toGlobalId, fromGlobalId} from 'graphql-relay';

import {ROLES} from '../../config';
import Database from './mock/DatabaseMock';

chai.use(sinonChai);

global.chai = chai;
global.assert = chai.assert;
global.expect = chai.expect;
global.should = chai.should();
global.sinon = sinon;
global.request = request;

global.log = (message) => {
  //console.log(message);
};

global.withActualId = function (node) {
  const {type, id} = fromGlobalId(node.id);
  node.id = id;
  return node;
};

global.deleteRequireCache = function (modules) {
  modules.forEach(module => {
    if (module.includes('**')) {
      let searchTerm = module.replace('**', '');
      let excludeNodeModules = false;
      if (module.startsWith('./')) {
        excludeNodeModules = true;
        searchTerm = searchTerm.replace('./', '');
      }

      Object.keys(require.cache).forEach(key => {
        const isNodeModule = excludeNodeModules && key.includes('node_modules');
        if (!isNodeModule && key.includes(searchTerm)) {
          delete require.cache[key]
        }
      });

    }
    else {
      delete require.cache[require.resolve(module)];
    }
  });

};

global.getSessionFromResponseCookie = function (response) {
  // looks like session=eyJ0b2tlbiI6ImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSklVekkxTmlKOS5leUpwWkNJNklqRWlMQ0p5YjJ4bElqb2lkWE5sY2lJc0ltbGhkQ0k2TVRRMU56UTFOekF3TW4wLm5yLUtaaXFfdW5BSjhweEtrVGJqQnVOT25TMFo2NDJ3VHNudldFNjZnblEifQ==; path=/; httponly
  const cookieString = response.header['set-cookie'][0];
  // only get the session token
  const start = 8; // cut off first 8 letters ("session=")
  const end = cookieString.indexOf(';');
  // decode string to json
  const sessionString = new Buffer(cookieString.substring(start, end), 'base64').toString('utf8');
  // build an object
  return JSON.parse(sessionString);
};

global.checkRequestErrors = function (res) {
  const error = res.body.errors ? res.body.errors[0].message : '';
  assert.isNotOk(!!error, 'an error occured during request: ' + error);
};

global.login = function (role, server, next) {
  let email;

  if (role == ROLES.reader) {
    email = 'reader@test.com';
  }
  else if (role === ROLES.publisher) {
    email = 'publisher@test.com';
  }

  expect(email, 'provided role for login has been mapped to an email').to.be.ok;

  const query = `
      mutation {
        login(input: {id: "${Database.viewerId}", email: "${email}", password: "1234asdf", clientMutationId: "0"}) {
          user {
            email
          }
        }
      }
    `;

  server
    .post('/graphql')
    .query({ query })
    .expect(200)
    .end((err, res) => {
      checkRequestErrors(res);

      next(err, res);
    });
}