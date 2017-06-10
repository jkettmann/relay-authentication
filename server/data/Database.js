import { posts } from './testData/posts'
import { users } from './testData/users'
import { ROLES, ERRORS } from '../config'

import User from '../data/model/User'
import Post from '../data/model/Post'

import { isLoggedIn, canPublish } from '../authentication'

export default class Database {

  constructor() {
    this.users = users.map(user => new User(user))
    this.posts = posts.map(post => new Post(post))
  }

  createPost = ({ creatorId, title, description, image }, { userId, role }) => {
    if (!canPublish({ role })) {
      throw new Error(ERRORS.Forbidden)
    }

    const id = `${this.posts.length + 1}`
    const newPost = new Post({ id, creatorId: userId, title, image, description })
    this.posts.push(newPost)
    return newPost
  }

  getPost = id => this.posts.find(post => post.id === id)

  getPosts = () => this.posts

  getPostsForCreator = ({ userId, role } = {}) => {
    if (!isLoggedIn({ role })) {
      return []
    }

    return this.posts.filter(post => post.creatorId === userId)
  }

  getPostCreator = (post) => {
    // this is accessible by anyone so only return public data (no email etc.)
    const { firstName, lastName } = this.getUserById(post.creatorId)
    return { firstName, lastName }
  }

  getUserById = userId => userId && this.users.find(({ id }) => id === userId)

  getUserWithCredentials = (email, password) => {
    const user = this.users.find(
      userData => userData.email === email && userData.password === password,
    )

    if (!user) {
      throw new Error(ERRORS.WrongEmailOrPassword)
    }

    return user
  }

  createUser = ({ email, password, firstName, lastName, role }) => {
    const existingUser = this.users.find(user => user.email === email)

    if (existingUser) {
      throw new Error(ERRORS.EmailAlreadyTaken)
    }

    const newUser = new User({
      id: `${this.users.length + 1}`,
      email,
      password,
      firstName,
      lastName,
      role: role || ROLES.reader,
    })

    this.users.push(newUser)
    return { user: newUser }
  }
}
