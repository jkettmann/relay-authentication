import { fromGlobalId } from 'graphql-relay';

import { ROLES, Errors } from '../../../config';
import {viewerId} from './../mock/database-mock';
import {decodeToken} from '../../../server/authentication';

describe('GraphQL User', () => {

  let database;
  let mockPosts, mockPost1, mockPost2;
  let createGraphQlServer;
  let server;

  function deleteNecessaryRequireCaches() {
    deleteRequireCache(['./mock/database-mock', './graphql/**', '../../server/graphQlServer']);
  }

  before(() => {
    // replace database layer to use mock data
    mockery.enable({
      warnOnUnregistered: false
    });
  });

  beforeEach(() => {
    deleteNecessaryRequireCaches();
    database = require('./../mock/database-mock');
    mockPosts = database.mockPosts;
    mockPost1 = database.mockPost1;
    mockPost2 = database.mockPost2;
    mockery.registerMock('../database', database);
    createGraphQlServer = require('../../../server/graphQlServer').default;
    server = createGraphQlServer(8080);
  });

  afterEach((done) => {
    server.close(done);
    mockery.deregisterAll();
  });

  describe('createPost', () => {

    it('creates a new user', (done) => {
      const query = `
        mutation {
          register(input: {
                      email: "new@test.com",
                      password: "1234asdf",
                      firstName: "Fritz",
                      lastName: "Franz",
                      role: "${ROLES.reader}",
                      clientMutationId: "0"
          }) {
            user {
              id,
              email,
              role
            }
          }
        }
      `;

      request(server)
        .post('/graphql')
        .query({query})
        .expect(200)
        .end((err, res) => {
          checkRequestErrors(res);

          const user = withActualId(res.body.data.register.user);
          const error = res.body.data.register.error;

          expect(user, 'user data exists in response').to.be.ok;
          expect(error, 'no error in response').to.be.not.ok;

          expect(user.id).to.equal("3");
          expect(user.email).to.equal('new@test.com');
          expect(user.role).to.equal(ROLES.reader);

          done();
        });
    });

    it('returns error if user with same email already exists', (done) => {
      const query = `
        mutation {
          register (input: {
                      email: "user@test.com",
                      password: "1234asdf",
                      firstName: "Hans",
                      lastName: "Franz",
                      role: "${ROLES.reader}",
                      clientMutationId: "0"
          }) {
            user {
              id,
              email
            }
          }
        }
      `;

      request(server)
        .post('/graphql')
        .query({query})
        .expect(200)
        .end((err, res) => {
          const data = res.body.data.createPost;
          const errors = res.body.errors;

          expect(data, 'no user data in response').to.not.be.ok;
          expect(errors, 'error exists').to.be.ok;
          expect(errors.length, 'exactly one error exists').to.equal(1);
          expect(errors[0].message, 'correct error message').to.deep.equal(Errors.EmailAlreadyTaken);

          done();
        });

    });
  });

  describe('login', () => {

    it('sets anonymous session to cookie if no session is provided', (done) => {
      const query = `
        {
          viewer {
            user {
               id
            }
          }
        }
      `;

      request(server)
        .get('/graphql')
        .query({query})
        .end((err, res) => {
          checkRequestErrors(res);

          expect(res.header['set-cookie'].length).to.be.at.least(1);
          expect(res.header['set-cookie'][0]).to.include('session');

          const session = getSessionFromResponseCookie(res);
          expect(session, 'session was parsed correctly').to.be.ok;

          const authToken = session.token;
          expect(authToken, 'auth token has been set').to.be.ok;

          const tokenData = decodeToken(authToken);
          expect(tokenData.role, 'role in token is set correctly').to.equal(ROLES.anonymous);
          done();
        });
    });

    it('updates cookie with authenticated session token after login', (done) => {
      const query = `
        mutation {
          login(input: {id: "${viewerId}" email: "user@test.com", password: "1234asdf", clientMutationId: "0"}) {
            user {
              id,
              email
            }
          }
        }
      `;

      request(server)
        .post('/graphql')
        .query({query})
        .expect(200)
        .end((err, res) => {
          checkRequestErrors(res);

          const user = withActualId(res.body.data.login.user);
          expect(user, 'user data is correct').to.deep.equal({id: viewerId, email: 'reader@test.com'});

          const session = getSessionFromResponseCookie(res);
          expect(session, 'session was parsed correctly').to.be.ok;

          const authToken = session.token;
          expect(authToken, 'auth token has been set').to.be.ok;

          const tokenData = decodeToken(authToken);
          expect(tokenData.role, 'role in token is set correctly').to.equal(ROLES.reader);
          expect(tokenData.userId, 'user id is set correctly').to.equal('1');

          done();
        });
    });

    it('updates cookie with authenticated session token after login', (done) => {
      const query = `
      mutation {
        login(input: {id: "${viewerId}" email: "user@test.com", password: "1234asdf", clientMutationId: "0"}) {
          user {
            email
          }
        }
      }
    `;

      request(server)
        .post('/graphql')
        .query({query})
        .expect(200)
        .end((err, res) => {
          checkRequestErrors(res);

          const session = getSessionFromResponseCookie(res);
          expect(session, 'session was parsed correctly').to.be.ok;

          const authToken = session.token;
          expect(authToken, 'auth token has been set').to.be.ok;

          const tokenData = decodeToken(authToken);
          expect(tokenData.role, 'role in token is set correctly').to.equal(ROLES.reader);

          done();
        });
    });

    it('returns user data after login', (done) => {
      const query = `
      mutation {
        login(input: {id: "${viewerId}" email: "user@test.com", password: "1234asdf", clientMutationId: "0"}) {
          user {
            email,
            firstName,
            lastName
          }
        }
      }
    `;

      request(server)
        .post('/graphql')
        .query({query})
        .expect(200)
        .end((err, res) => {
          checkRequestErrors(res);

          const user = res.body.data.login.user;
          expect(user, 'user data is correct').to.deep.equal({
            email: 'reader@test.com',
            firstName: 'Hans',
            lastName: 'Franz'
          });

          done();
        });
    });

    it('returns error if user with email does not exist', (done) => {
      const query = `
        mutation {
          login(input: {id: "${viewerId}" email: "invalid@test.com", password: "1234asdf", clientMutationId: "0"}) {
            user {
              id,
              email
            }
          }
        }
      `;

      request(server)
        .post('/graphql')
        .query({query})
        .expect(200)
        .end((err, res) => {
          const data = res.body.data.login;
          expect(data, 'response does not contain user data').to.not.be.ok;

          const errors = res.body.errors;
          expect(errors, 'response contains error').to.be.ok;
          expect(errors.length, 'response contains one error').to.equal(1);
          expect(errors[0].message, 'error message is correct').to.equal(Errors.WrongEmailOrPassword);

          done();
        });
    });

    it('returns error if user with email does not exist', (done) => {
      const query = `
        mutation {
          login(input: {id: "${viewerId}" email: "user@test.com", password: "1234asd", clientMutationId: "0"}) {
            user {
              id,
              email
            }
          }
        }
      `;

      request(server)
        .post('/graphql')
        .query({query})
        .expect(200)
        .end((err, res) => {
          const data = res.body.data.login;
          expect(data, 'response does not contain user data').to.not.be.ok;

          const errors = res.body.errors;
          expect(errors, 'response contains error').to.be.ok;
          expect(errors.length, 'response contains one error').to.equal(1);
          expect(errors[0].message, 'error message is correct').to.equal(Errors.WrongEmailOrPassword);

          done();
        });
    });

  });

  describe('logout', () => {

    it('resets token data to anonymous after logout', (done) => {

      const user = request.agent(server);

      login(ROLES.reader, user, () => {
        const query = `
          mutation {
            logout(input: {id: "${viewerId}", clientMutationId: "0"}) {
              user {
                id,
                email
              }
            }
          }
        `;

        user.post('/graphql')
          .query({query})
          .end((err, res) => {
            checkRequestErrors(res);

            const session = getSessionFromResponseCookie(res);
            expect(session, 'session was parsed correctly').to.be.ok;

            const authToken = session.token;
            expect(authToken, 'auth token has been set').to.be.ok;

            const tokenData = decodeToken(authToken);
            expect(tokenData.role, 'role in token is set correctly').to.equal(ROLES.anonymous);
            done();
          });
      });
    });

  });

  describe('restricted', () => {

    it('personal data can be accessed when logged in', (done) => {

      const user = request.agent(server);

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
        `;

        user.post('/graphql')
          .query({query})
          .expect(200)
          .end((err, res) => {
            checkRequestErrors(res);

            const userData = res.body.data.viewer.user;
            expect(userData).to.deep.equal({firstName: 'Hans', lastName:'Franz'});

            done();
          });

      });
    });

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
      `;

      request(server)
        .post('/graphql')
        .query({query})
        .expect(200)
        .end((err, res) => {
          checkRequestErrors(res);

          const userData = res.body.data.viewer.user;
          expect(userData).to.deep.equal({firstName: null, lastName: null});

          done();

        });
    });

    it('posts can be accessed when logged in', (done) => {

      const user = request.agent(server);

      login(ROLES.publisher, user, () => {

        const query = `
          {
            viewer {
              user {
                id,
                posts (first: 100) {
                  edges {
                    node {
                      creatorId,
                      title
                    }
                  }
                }
              }
            }
          }
        `;

        user.post('/graphql')
          .query({query})
          .expect(200)
          .end((err, res) => {
            checkRequestErrors(res);

            const userData = res.body.data.viewer.user;
            const posts = userData.posts.edges;
            expect(posts.length).to.equal(5);

            posts.forEach(post => expect(post.creatorId).to.equal(userData.userId));


            done();
          });

      });
    });

    it('posts are empty when not logged in', (done) => {

      const query = `
        {
          viewer {
            user {
              id,
              posts (first: 100) {
                edges {
                  node {
                    creatorId,
                    title
                  }
                }
              }
            }
          }
        }
      `;

      request(server)
        .post('/graphql')
        .query({query})
        .expect(200)
        .end((err, res) => {
          checkRequestErrors(res);

          const userData = res.body.data.viewer.user;
          const posts = userData.posts.edges;
          expect(posts.length).to.equal(0);

          done();

      });
    });

  });

});