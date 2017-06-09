import { ROLES, ERRORS } from '../../config'

import User from '../../data/model/User'
import Post from '../../data/model/Post'

import { posts } from './testData/posts'
import { users } from './testData/users'

import { isLoggedIn } from '../../authentication'

export default class Database {
  static mockPost1 = posts[0]
  static mockPost2 = posts[1]
  static mockPosts = posts

  createPost = ({ creatorId, title, image, description }) => {
    const id = `${posts.length + 1}`
    const newPost = new Post({ creatorId, id, title, image, description })
    posts.push(newPost)
    return newPost
  }

  getPost = id => posts.find(post => post.id === id)

  getPosts = () => posts

  getPostsForCreator = ({ userId, role } = {}) => {
    if (!isLoggedIn({ role })) {
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
      throw new Error(ERRORS.WrongEmailOrPassword)
    }

    return user
  }

  createUser = (email, password, firstName, lastName, role) => {
    const existingUser = users.find(user => user.email === email)

    if (existingUser) {
      throw new Error(ERRORS.EmailAlreadyTaken)
    }

    const newUser = new User({
      id: `${users.length + 1}`,
      email,
      password,
      firstName,
      lastName,
      role: role || ROLES.user,
    })

    users.push(newUser)
    return { user: newUser }
  }
}
