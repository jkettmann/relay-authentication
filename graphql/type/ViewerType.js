import { GraphQLObjectType, GraphQLString} from "graphql";
import { connectionArgs, connectionFromArray, globalIdField, fromGlobalId } from 'graphql-relay';

import UserType from "./UserType";
import PostType from './PostType';
import PostConnection from './PostConnection';

import { ROLES } from '../../config';

export default new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    user: {
      type:  UserType,
      resolve: (obj, args, { db }, { rootValue: {tokenData } })  => {
        // tokenData origins from a cookie containing session data.
        // this is necessary to make session data persistent over refreshing the browser
        if (tokenData && tokenData.userId && tokenData.role && tokenData.role !== ROLES.anonymous) {
          return db.getViewerById(tokenData.userId);
        }
        else {
          return db.getAnonymousUser();
        }
      }
    },
    posts: {
      type: PostConnection.connectionType,
      args: connectionArgs,
      resolve: (obj, args, { db }) => connectionFromArray(db.getPosts(), args)
    },
    post: {
      type: PostType,
      args: {
        postId: { type: GraphQLString }
      },
      resolve: (obj, {postId}, { db }) => {
        const {type, id} = fromGlobalId(postId);
        if (type == 'Post') {
          return db.getPost(id);
        }
        else {
          return null;
        }
      }
    }
  })
});