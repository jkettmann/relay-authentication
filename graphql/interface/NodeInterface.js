import { nodeDefinitions, fromGlobalId } from "graphql-relay";

import UserType from '../type/UserType';
import PostType from '../type/PostType';

import { getViewerById, getPost } from '../database';

import User from '../../data/model/User';
import Post from '../../data/model/Post';

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    switch (type) {

      case 'User':
        log('NodeInterface: get user with id ' + id);
        return getViewerById(id);

      case 'Post':
        return getPost(id);

      default:
        return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return UserType;
    }
    else if (obj instanceof Post) {
      return PostType;
    }
  }
);

export const NodeInterface = nodeInterface;
export const NodeField = nodeField;