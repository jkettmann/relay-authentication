import {toGlobalId} from 'graphql-relay';

import {ROLES} from '../../../config';
import {viewerId} from '../mock/database-mock';
import {decodeToken} from '../../../server/authentication';

describe('GraphQL Posts', () => {

  let database;
  let mockPosts, mockPost1, mockPost2;
  let createGraphQlServer;
  let server;

  function deleteNecessaryRequireCaches () {
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
    database = require('./../mock/Database-mock');
    mockPosts = database.mockPosts;
    mockPost1 = database.mockPost1;
    mockPost2 = database.mockPost2;
    mockery.registerMock('../Database', database);
    createGraphQlServer = require('../../../server/graphQlServer').default;
    server = createGraphQlServer(8080);
  });

  afterEach((done) => {
    server.close(done);
    mockery.deregisterAll();
  });

  it('delivers all posts', (done) => {
    const query = `
      {
        viewer {
          posts {
            edges {
              node {
                id, creatorId, title, image, description
              }
            }
          }
        }
      }
    `;

    request(server)
      .get('/graphql')
      .query({ query })
      .expect(200)
      .end((err, res) => {
        checkRequestErrors(res);

        const posts = res.body.data.viewer.posts;
        expect(posts.edges.length, 'number of posts is ' + mockPosts.lentgh).to.equal(mockPosts.length);

        const post1 = withActualId(posts.edges[0].node);
        const post2 = withActualId(posts.edges[1].node);

        expect(post1, 'first post equals mock data').to.deep.equal(mockPost1);
        expect(post2, 'second post equals mock data').to.deep.equal(mockPost2);

        done();
      });
  });

  it('supports pagination for posts', (done) => {
    const firstQuery = `
      {
        viewer {
          posts(first: 1) {
            edges {
              cursor,
              node {
                id, creatorId, title, image, description
              }
            }
          }
        }
      }
    `;

    request(server)
      .get('/graphql')
      .query({ query: firstQuery })
      .end((err, res) => {
        checkRequestErrors(res);

        const cursor = res.body.data.viewer.posts.edges[0].cursor;
        expect(cursor).to.be.ok;

        const firstPost = withActualId(res.body.data.viewer.posts.edges[0].node);
        expect(firstPost).to.deep.equal(mockPost1);

        const secondQuery = `
          {
            viewer {
              posts(first: 1 after: "${cursor}") {
                edges {
                  node {
                    id, creatorId, title, image, description
                  }
                }
              }
            }
          }
        `;

        request(server)
          .get('/graphql')
          .query({ query: secondQuery })
          .expect(200)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            const secondPost = withActualId(res.body.data.viewer.posts.edges[0].node);
            expect(secondPost).to.deep.equal(mockPost2);

            done();
          });
      });
  });

  it('delivers a post requested by id', (done) => {
    const postId = toGlobalId("Post", "2");
    const query = `
      {
        viewer {
          post(postId: "${postId}") {
            id, creatorId, title, image, description
          }
        }
      }
    `;

    request(server)
      .get('/graphql')
      .query({ query })
      .expect(200)
      .end((err, res) => {
        checkRequestErrors(res);

        const post = withActualId(res.body.data.viewer.post);
        expect(post).to.deep.equal(mockPost2);

        done();
      });

  });

  it('does not allow to create post without publisher role', (done) => {
    const title = 'newTitle';
    const image = 'newImg';
    const description = 'description';
    const query = `
      mutation {
        createPost(input: {creatorId: "2", title: "${title}", image: "${image}", description: "${description}", clientMutationId: "0"}) {
          postEdge {
            node {
              id,
              creatorId,
              title,
              image,
              description
            }
          }
        }
      }
    `;

    request(server)
      .post('/graphql')
      .query({ query })
      .expect(200)
      .end((err, res) => {
        checkRequestErrors(res);

        const newPost = res.body.data.createPost.postEdge.node;
        expect(newPost).to.not.be.ok;

        done();
      });
  });

  it('can create a new post when user has role publisher', (done) => {

    const user = request.agent(server);

    login(ROLES.publisher, user, () => {
      const creatorId = "2";
      const title = 'newTitle';
      const image = 'newImg';
      const description = 'description';
      const query = `
        mutation {
          createPost(input: {creatorId: "${creatorId}", title: "${title}", image: "${image}", description: "${description}", clientMutationId: "0"}) {
            postEdge {
              node {
                id,
                title,
                image,
                description
              }
            }
          }
        }
      `;

      sinon.spy(database, 'createPost');

      user.post('/graphql')
        .query({query})
        .expect(200)
        .end((err, res) => {
          checkRequestErrors(res);

          expect(database.createPost).to.have.been.calledOnce;
          expect(database.createPost).to.have.been.calledWith({ creatorId: "2", clientMutationId: "0", image: "newImg", title: 'newTitle', description: "description" });

          done();
        });
    });
  });

  it('returns new post after creation', (done) => {
    const user = request.agent(server);

    login(ROLES.publisher, user, () => {
      const creatorId = "2";
      const title = 'newTitle';
      const image = 'newImg';
      const description = 'description';
      const query = `
        mutation {
          createPost(input: {creatorId: "${creatorId}", title: "${title}", image: "${image}", description: "${description}", clientMutationId: "0"}) {
            postEdge {
              node {
                id,
                creatorId,
                title,
                image,
                description
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

          const newPost = res.body.data.createPost.postEdge.node;
          expect(newPost.id).to.be.ok;
          expect(newPost).to.deep.equal({creatorId: creatorId, id: newPost.id, title, image, description});

          done();
        });
    });
  });

});



