/* eslint-disable no-undef, no-unused-expressions */
import Database from '../../data/Database'
import createGraphQlServer from '../../graphql/server'

import { ROLES, ERRORS } from '../../config'
import { decodeToken } from '../../authentication'

describe('GraphQL User', () => {
  let database
  let server

  beforeEach(() => {
    database = new Database()
    server = createGraphQlServer(8080, database)
  })

  afterEach((done) => {
    server.close(done)
  })

  describe('create', () => {
    it('creates a new user', (done) => {
      const query = `
        mutation {
          register(input: {
            email: "new@test.com",
            password: "qwerty",
            firstName: "Fritz",
            lastName: "Franz",
          }) {
            user {
              id
              email
              role
            }
          }
        }
      `

      request(server)
        .post('/graphql')
        .query({ query })
        .expect(200)
        .end((err, res) => {
          checkRequestErrors(res)

          const user = withActualId(res.body.data.register.user)
          const error = res.body.data.register.error

          expect(user, 'user data exists in response').to.be.ok
          expect(error, 'no error in response').to.be.not.ok

          expect(user.id).to.equal('4')
          expect(user.email).to.equal('new@test.com')
          expect(user.role).to.equal(ROLES.reader)

          done()
        })
    })

    it('returns error if user with same email already exists', (done) => {
      const query = `
        mutation {
          register (input: {
            email: "reader@test.com",
            password: "qwerty",
            firstName: "Regina",
            lastName: "Reader",
          }) {
            user {
              id,
              email
            }
          }
        }
      `

      request(server)
        .post('/graphql')
        .query({ query })
        .expect(200)
        .end((err, res) => {
          const data = res.body.data.register
          const errors = res.body.errors

          expect(data, 'no data in response').to.not.be.ok
          expect(errors, 'error exists').to.be.ok
          expect(errors.length, 'exactly one error exists').to.equal(1)
          expect(errors[0].message, 'correct error message').to.deep.equal(
            ERRORS.EmailAlreadyTaken,
          )

          done()
        })
    })
  })

  describe('login', () => {
    it('sets no session cookie if initially no session cookie is provided', (done) => {
      const query = `
        {
          viewer {
            user {
               id
            }
          }
        }
      `

      request(server).get('/graphql').query({ query }).end((err, res) => {
        checkRequestErrors(res)

        expect(res.header['set-cookie']).to.not.be
        done()
      })
    })

    it('updates cookie with authenticated session token after login', (done) => {
      const query = `
        mutation {
          login(input: {email: "reader@test.com", password: "qwerty"}) {
            user {
              id,
              email
            }
          }
        }
      `

      request(server)
        .post('/graphql')
        .query({ query })
        .expect(200)
        .end((err, res) => {
          checkRequestErrors(res)

          const user = withActualId(res.body.data.login.user)
          expect(user, 'user data is correct').to.deep.equal({
            id: '1',
            email: 'reader@test.com',
          })

          const session = getSessionFromResponseCookie(res)
          expect(session, 'session was parsed correctly').to.be.ok

          const authToken = session.token
          expect(authToken, 'auth token has been set').to.be.ok

          const tokenData = decodeToken(authToken)
          expect(tokenData.role, 'role in token is set correctly').to.equal(
            ROLES.reader,
          )
          expect(tokenData.userId, 'user id is set correctly').to.equal('1')

          done()
        })
    })

    it('updates cookie with authenticated session token after login', (done) => {
      const query = `
      mutation {
        login(input: {email: "reader@test.com", password: "qwerty"}) {
          user {
            email
          }
        }
      }
    `

      request(server)
        .post('/graphql')
        .query({ query })
        .expect(200)
        .end((err, res) => {
          checkRequestErrors(res)

          const session = getSessionFromResponseCookie(res)
          expect(session, 'session was parsed correctly').to.be.ok

          const authToken = session.token
          expect(authToken, 'auth token has been set').to.be.ok

          const tokenData = decodeToken(authToken)
          expect(tokenData.role, 'role in token is set correctly').to.equal(
            ROLES.reader,
          )

          done()
        })
    })

    it('returns user data after login', (done) => {
      const query = `
      mutation {
        login(input: {email: "reader@test.com", password: "qwerty"}) {
          user {
            email,
            firstName,
            lastName
          }
        }
      }
    `

      request(server)
        .post('/graphql')
        .query({ query })
        .expect(200)
        .end((err, res) => {
          checkRequestErrors(res)

          const user = res.body.data.login.user
          expect(user, 'user data is correct').to.deep.equal({
            email: 'reader@test.com',
            firstName: 'Regina',
            lastName: 'Reader',
          })

          done()
        })
    })

    it('returns error if user with email does not exist', (done) => {
      const query = `
        mutation {
          login(input: {email: "invalid@test.com", password: "qwerty"}) {
            user {
              id,
              email
            }
          }
        }
      `

      request(server)
        .post('/graphql')
        .query({ query })
        .expect(200)
        .end((err, res) => {
          const data = res.body.data.login
          expect(data, 'response does not contain user data').to.not.be.ok

          const errors = res.body.errors
          expect(errors, 'response contains error').to.be.ok
          expect(errors.length, 'response contains one error').to.equal(1)
          expect(errors[0].message, 'error message is correct').to.equal(
            ERRORS.WrongEmailOrPassword,
          )

          done()
        })
    })

    it('returns error if user with password does not exist', (done) => {
      const query = `
        mutation {
          login(input: {email: "reader@test.com", password: "wrongPassword"}) {
            user {
              id,
              email
            }
          }
        }
      `

      request(server)
        .post('/graphql')
        .query({ query })
        .expect(200)
        .end((err, res) => {
          const data = res.body.data.login
          expect(data, 'response does not contain user data').to.not.be.ok

          const errors = res.body.errors
          expect(errors, 'response contains error').to.be.ok
          expect(errors.length, 'response contains one error').to.equal(1)
          expect(errors[0].message, 'error message is correct').to.equal(
            ERRORS.WrongEmailOrPassword,
          )

          done()
        })
    })
  })

  describe('logout', () => {
    it('resets token data to anonymous after logout', (done) => {
      const user = request.agent(server)

      login(ROLES.reader, user, () => {
        const query = `
          mutation {
            logout(input: {}) {
              user {
                id,
                email
              }
            }
          }
        `

        user.post('/graphql').query({ query }).end((err, res) => {
          checkRequestErrors(res)

          const session = getSessionFromResponseCookie(res)
          expect(session, 'session was parsed correctly').to.be.ok

          const authToken = session.token
          expect(authToken, 'auth token has been set').to.not.be.ok

          done()
        })
      })
    })
  })

  describe('restricted', () => {
    it('personal data can be accessed when logged in', (done) => {
      const user = request.agent(server)

      login(ROLES.reader, user, () => {
        const query = `
          {
            viewer {
              user {
                firstName,
                lastName
              }
            }
          }
        `

        user.post('/graphql').query({ query }).expect(200).end((err, res) => {
          checkRequestErrors(res)

          const userData = res.body.data.viewer.user
          expect(userData).to.deep.equal({
            firstName: 'Regina',
            lastName: 'Reader',
          })

          done()
        })
      })
    })

    it('personal data is empty when not logged in', (done) => {
      const query = `
        {
          viewer {
            user {
              firstName,
              lastName
            }
          }
        }
      `

      request(server)
        .post('/graphql')
        .query({ query })
        .expect(200)
        .end((err, res) => {
          checkRequestErrors(res)

          const userData = res.body.data.viewer.user
          expect(userData).to.equal(null)

          done()
        })
    })

    it('posts can be accessed when logged in', (done) => {
      const user = request.agent(server)

      login(ROLES.publisher, user, () => {
        const query = `
          {
            viewer {
              user {
                id
                posts (first: 100) {
                  edges {
                    node {
                      id
                      creator {
                        firstName
                      }
                      title
                      description
                      image
                    }
                  }
                }
              }
            }
          }
        `

        user.post('/graphql').query({ query }).expect(200).end((err, res) => {
          checkRequestErrors(res)

          const userData = res.body.data.viewer.user
          const posts = userData.posts.edges
          expect(posts.length).to.equal(5)

          posts.forEach(({ node }) => {
            const post = withActualId(node)
            const dbPost = getPostWithCreatorFirstName(database, database.posts.find(({ id }) => id === post.id))
            expect(post).to.deep.equal(dbPost)
          })

          done()
        })
      })
    })
  })
})
/* eslint-enable no-undef, no-unused-expressions */
