import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql";
import { connectionArgs, connectionFromArray, globalIdField, fromGlobalId } from 'graphql-relay';

import ViewerType from './ViewerType';
import { NodeField } from "../interface/NodeInterface";

export default new GraphQLObjectType({
  name: "Root",
  fields: () => ({
    node: NodeField,
    viewer: {
      type: ViewerType,
      resolve: ({ tokenData }) => {
        return {id: tokenData.userId};
      }
    }
  })
});