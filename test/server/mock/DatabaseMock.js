import { ROLES, Errors } from '../../../config'

import User from '../../../data/model/User'
import Post from '../../../data/model/Post'

import { posts } from './testData/posts'
import { users } from './testData/users'

export default class Database {
  static mockPost1 = posts[0]
  static mockPost2 = posts[1]
  static mockPosts = posts
  static viewerId = 'qoyciemasklfhkel'

  createPost = ({ creatorId, title, image, description }) => {
    const id = posts.length + 1
    const newPost = new Post({ creatorId, id, title, image, description })
    posts.push(newPost)
    return newPost
  }

  getPost = id => posts.find(post => post.id === id)

  getPosts = () => posts

  getPostsForCreator = id => {
    const userPosts = posts.filter(post => post.creatorId === id)
    return userPosts || []
  }

  getAnonymousUser = () =>
    new User({ id: Database.viewerId, role: ROLES.anonymous })

  getViewerById = userId => {
    if (!userId || userId === 'anonymous') {
      return this.getAnonymousUser()
    }

    const user = this.copy(users.find(({ id }) => id === userId))
    if (user) {
      user.userId = user.id
      user.id = Database.viewerId
    }
    return user
  }

  getUserWithCredentials = (email, password) => {
    const user = this.copy(
      users.find(
        userData => userData.email === email && userData.password === password,
      ),
    )

    if (!user) {
      throw new Error(Errors.WrongEmailOrPassword)
    }

    // We exchange the actual id with our static viewerId so that the anonymous user and the logged in user have the same id.
    // Because of this the user in relay store will be updated and corresponding components rerendered. If anonymous and
    // logged in user don't share the same id, the data for anonymous user will stay in the store and components will
    // only be updated after refresh (store is deleted and user will be refetched based on session data)
    user.userId = user.id
    user.id = Database.viewerId
    return user
  }

  createUser = (email, password, firstName, lastName, role) => {
    const existingUser = users.find(user => user.email === email)

    if (existingUser) {
      throw new Error(Errors.EmailAlreadyTaken)
    }

    const newUser = new User({ email, password, firstName, lastName, role })
    newUser.id = `${users.length + 1}`
    users.push(newUser)
    return { user: newUser }
  }

  copy = object => {
    if (!object) {
      return object
    }

    return { ...object }
  }
}
