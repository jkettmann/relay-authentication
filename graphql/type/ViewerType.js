import { GraphQLObjectType, GraphQLString} from "graphql";
import { connectionArgs, connectionFromArray, globalIdField, fromGlobalId } from 'graphql-relay';

import UserType from "./UserType";
import PostType from './PostType';
import PostConnection from './PostConnection';
import { NodeInterface } from '../interface/NodeInterface';

import { getAnonymousUser, getViewerById, getPosts, getPost } from '../database';
import { ROLES } from '../../config';

export default new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    user: {
      type:  UserType,
      resolve: (obj, args, { rootValue: {tokenData } })  => {
        // tokenData origins from a cookie containing session data.
        // this is necessary to make session data persistent over refreshing the browser
        if (tokenData && tokenData.userId && tokenData.role && tokenData.role !== ROLES.anonymous) {
          return getViewerById(tokenData.userId);
        }
        else {
          return getAnonymousUser();
        }
      }
    },
    posts: {
      type: PostConnection.connectionType,
      args: connectionArgs,
      resolve: (obj, args) => connectionFromArray(getPosts(), args)
    },
    post: {
      type: PostType,
      args: {
        postId: { type: GraphQLString }
      },
      resolve: (obj, {postId}) => {
        const {type, id} = fromGlobalId(postId);
        if (type == 'Post') {
          return getPost(id);
        }
        else {
          return null;
        }
      }
    }
  })
});