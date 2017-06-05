import { posts } from './testData/posts'
import { users } from './testData/users'
import { ROLES, Errors } from '../config'

import User from '../data/model/User'
import Post from '../data/model/Post'

const viewerId = '__someRandomId__'

export default class Database {
  createPost = ({ creatorId, title, description, image }) => {
    const id = `${posts.length + 1}`
    const newPost = new Post({ id, creatorId, title, image, description })
    posts.push(newPost)

    return newPost
  }

  getPost = id => posts.find(post => post.id === id)

  getPosts = () => posts

  getPostsForCreator = ({ userId, role } = {}) => {
    if (role === ROLES.anonymous) {
      return []
    }

    return posts.filter(post => post.creatorId === userId)
  }

  getPostCountForCreator = ({ userId, role }) =>
    this.getPostsForCreator({ userId, role }).length

  getAnonymousUser = () => new User({ id: viewerId, role: ROLES.anonymous })

  getCurrentUser = ({ userId, role }) => {
    if (!userId || role === 'anonymous') {
      return this.getAnonymousUser()
    }

    const user = this.copy(this.getUserById(userId))
    if (user) {
      user.userId = user.id
      user.id = viewerId
    }
    return user
  }

  getUserById = userId => users.find(({ id }) => id === userId)

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
    user.id = viewerId
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