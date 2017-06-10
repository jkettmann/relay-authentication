import { GraphQLObjectType } from 'graphql'

import RegisterMutation from '../mutation/RegisterMutation'
import LoginMutation from '../mutation/LoginMutation'
import LogoutMutation from '../mutation/LogoutMutation'
import CreatePostMutation from '../mutation/CreatePostMutation'

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    register: RegisterMutation,
    login: LoginMutation,
    logout: LogoutMutation,
    createPost: CreatePostMutation,
  }),
})
