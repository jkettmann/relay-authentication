import { ROLES } from '../../config'
import { Errors } from '../../../config'

import User from '../../data/model/User'
import Post from '../../data/model/Post'

import { posts } from './testData/posts'
import { users } from './testData/users'

export default class Database {
  static mockPost1 = posts[0]
  static mockPost2 = posts[1]
  static mockPosts = posts

  createPost = ({ creatorId, title, image, description }) => {
    const id = posts.length + 1
    const newPost = new Post({ creatorId, id, title, image, description })
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

  getUserById = userId => userId && users.find(({ id }) => id === userId)

  getUserWithCredentials = (email, password) => {
    const user = users.find(
      userData => userData.email === email && userData.password === password,
    )

    if (!user) {
      throw new Error(Errors.WrongEmailOrPassword)
    }

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
}
