// ---------------------------------------
// Test Environment Setup
// ---------------------------------------
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import request from 'supertest'
import base64 from 'base-64'
import { fromGlobalId } from 'graphql-relay'

import { decodeToken } from '../authentication'
import { ROLES } from '../config'

chai.use(sinonChai)

global.chai = chai
global.assert = chai.assert
global.expect = chai.expect
global.should = chai.should()
global.sinon = sinon
global.request = request

// global.log = (...args) => {
//   console.log(...args)
// }

global.log = () => {}

global.withActualId = (node) => {
  const { id } = fromGlobalId(node.id)
  // eslint-disable-next-line no-param-reassign
  node.id = id
  return node
}

global.getSessionDataFromAgent = (agent) => {
  const session = agent.jar.getCookie('session', { path: '/' })
  const { token } = JSON.parse(base64.decode(session.value))
  return decodeToken(token)
}

// get the expected response object for a post with queried creator id
// from mock object where creatorId is set directly
global.getPostWithCreatorFirstName = (db, post) =>
    Object.keys(post).reduce((newPost, key) => {
      if (key === 'creatorId') {
        const creator = db.getPostCreator(post)
        return { ...newPost, creator: creator && { firstName: creator.firstName } }
      }

      return { ...newPost, [key]: post[key] }
    },
    {},
  )

global.deleteRequireCache = (modules) => {
  modules.forEach((module) => {
    if (module.includes('**')) {
      let searchTerm = module.replace('**', '')
      let excludeNodeModules = false
      if (module.startsWith('./')) {
        excludeNodeModules = true
        searchTerm = searchTerm.replace('./', '')
      }

      Object.keys(require.cache).forEach((key) => {
        const isNodeModule = excludeNodeModules && key.includes('node_modules')
        if (!isNodeModule && key.includes(searchTerm)) {
          delete require.cache[key]
        }
      })
    } else {
      delete require.cache[require.resolve(module)]
    }
  })
}

global.getSessionFromResponseCookie = (response) => {
  // looks like session=__SOME_TOKEN__; path=/; httponly
  const cookieString = response.header['set-cookie'][0]
  // only get the session token
  const start = 8 // cut off first 8 letters ("session=")
  const end = cookieString.indexOf(';')
  // decode string to json
  const sessionString = new Buffer(
    cookieString.substring(start, end),
    'base64',
  ).toString('utf8')
  // build an object
  return JSON.parse(sessionString)
}

global.checkRequestErrors = (res) => {
  const error = res.body.errors ? res.body.errors[0].message : ''

  // eslint-disable-next-line no-undef
  assert.isNotOk(!!error, `an error occured during request: ${error}`)
}

global.login = (role, server, next) => {
  let email

  if (role === ROLES.reader) {
    email = 'reader@test.com'
  } else if (role === ROLES.publisher) {
    email = 'publisher@test.com'
  }

  // eslint-disable-next-line no-undef, no-unused-expressions
  expect(email, 'provided role for login has been mapped to an email').to.be.ok

  const query = `
      mutation {
        login(input: {email: "${email}", password: "qwerty"}) {
          user {
            email
          }
        }
      }
    `

  server.post('/graphql').query({ query }).expect(200).end((err, res) => {
    // eslint-disable-next-line no-undef
    checkRequestErrors(res)

    next(err, res)
  })
}
