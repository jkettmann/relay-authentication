/* eslint-disable no-undef, no-unused-expressions */
import { toGlobalId } from 'graphql-relay'

import Database from '../../data/Database'
import createGraphQlServer from '../../graphql/server'

import { ROLES, ERRORS } from '../../config'

describe('GraphQL Posts', () => {
  let database
  let server

  beforeEach(() => {
    database = new Database()
    server = createGraphQlServer(8080, database)
  })

  afterEach((done) => {
    server.close(done)
  })

  it('delivers all posts', (done) => {
    const query = `
      {
        viewer {
          posts {
            edges {
              node {
                id, creator { firstName }, title, image, description
              }
            }
          }
        }
      }
    `

    request(server)
      .get('/graphql')
      .query({ query })
      .expect(200)
      .end((err, res) => {
        checkRequestErrors(res)

        const posts = res.body.data.viewer.posts
        expect(
          posts.edges.length,
          `number of posts is ${database.posts.lentgh}`,
        ).to.equal(database.posts.length)

        const post1 = withActualId(posts.edges[0].node)
        const post2 = withActualId(posts.edges[1].node)

        expect(post1, 'first post equals mock data').to.deep.equal(getPostWithCreatorFirstName(database, database.posts[0]))
        expect(post2, 'second post equals mock data').to.deep.equal(getPostWithCreatorFirstName(database, database.posts[1]))

        done()
      })
  })

  it('supports pagination for posts', (done) => {
    const firstQuery = `
      {
        viewer {
          posts(first: 1) {
            edges {
              cursor,
              node {
                id, creator { firstName }, title, image, description
              }
            }
          }
        }
      }
    `

    request(server)
      .get('/graphql')
      .query({ query: firstQuery })
      .end((err, res) => {
        checkRequestErrors(res)

        const cursor = res.body.data.viewer.posts.edges[0].cursor
        expect(cursor).to.be.ok

        const firstPost = withActualId(res.body.data.viewer.posts.edges[0].node)
        expect(firstPost).to.deep.equal(getPostWithCreatorFirstName(database, database.posts[0]))

        const secondQuery = `
          {
            viewer {
              posts(first: 1 after: "${cursor}") {
                edges {
                  node {
                    id, creator { firstName }, title, image, description
                  }
                }
              }
            }
          }
        `

        request(server)
          .get('/graphql')
          .query({ query: secondQuery })
          .expect(200)
          .end((error, secondRes) => {
            if (error) {
              throw error
            }

            const secondPost = withActualId(
              secondRes.body.data.viewer.posts.edges[0].node,
            )
            expect(secondPost).to.deep.equal(getPostWithCreatorFirstName(database, database.posts[1]))

            done()
          })
      })
  })

  it('delivers a post requested by id', (done) => {
    const postId = toGlobalId('Post', 2)
    const query = `
      {
        viewer {
          post(postId: "${postId}") {
            id, creator { firstName }, title, image, description
          }
        }
      }
    `

    request(server)
      .get('/graphql')
      .query({ query })
      .expect(200)
      .end((err, res) => {
        checkRequestErrors(res)

        const post = withActualId(res.body.data.viewer.post)
        expect(post).to.deep.equal(getPostWithCreatorFirstName(database, database.posts[1]))

        done()
      })
  })

  it('does not allow to create post without publisher role', (done) => {
    const title = 'newTitle'
    const image = 'newImg'
    const description = 'description'
    const query = `
      mutation {
        createPost(input: {title: "${title}", image: "${image}", description: "${description}"}) {
          postEdge {
            node {
              id,
              creator { firstName },
              title,
              image,
              description
            }
          }
        }
      }
    `

    request(server)
      .post('/graphql')
      .query({ query })
      .expect(200)
      .end((err, res) => {
        expect(res.body.errors[0].message).to.equal(ERRORS.Forbidden)
        expect(res.body.data.createPost).to.not.be.ok

        done()
      })
  })

  it('can create a new post when user has role publisher', (done) => {
    const user = request.agent(server)

    login(ROLES.publisher, user, () => {
      const title = 'newTitle'
      const image = 'newImg'
      const description = 'description'
      const query = `
        mutation {
          createPost(input: {title: "${title}", image: "${image}", description: "${description}"}) {
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
      `

      sinon.spy(database, 'createPost')

      user.post('/graphql').query({ query }).expect(200).end((err, res) => {
        checkRequestErrors(res)

        const sessionData = getSessionDataFromAgent(user)
        expect(database.createPost).to.have.been.calledOnce
        expect(database.createPost).to.have.been.calledWith(
          {
            image: 'newImg',
            title: 'newTitle',
            description: 'description',
          },
          sessionData,
        )

        done()
      })
    })
  })

  it('returns new post after creation', (done) => {
    const user = request.agent(server)

    login(ROLES.publisher, user, () => {
      const firstName = 'Peter'
      const title = 'newTitle'
      const image = 'newImg'
      const description = 'description'
      const query = `
        mutation {
          createPost(input: {title: "${title}", image: "${image}", description: "${description}"}) {
            postEdge {
              node {
                id,
                creator { firstName },
                title,
                image,
                description
              }
            }
          }
        }
      `

      user.post('/graphql').query({ query }).expect(200).end((err, res) => {
        checkRequestErrors(res)

        const newPost = res.body.data.createPost.postEdge.node
        expect(newPost.id).to.be.ok
        expect(newPost).to.deep.equal({
          creator: { firstName },
          id: newPost.id,
          title,
          image,
          description,
        })

        done()
      })
    })
  })
})
/* eslint-enable no-undef, no-unused-expressions */
