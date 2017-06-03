import Relay from 'react-relay'

export default class CreatePostMutation extends Relay.Mutation {
  // eslint-disable-next-line class-methods-use-this
  getMutation() {
    return Relay.QL`mutation { createPost }`
  }

  getVariables() {
    return {
      creatorId: this.props.user.id,
      title: this.props.title,
      description: this.props.description,
    }
  }

  getFiles() {
    return {
      image: this.props.image,
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getFatQuery() {
    return Relay.QL`
      fragment on CreatePostPayload {
        postEdge,
        user {
          posts
        }
      }
    `
  }

  getConfigs() {
    return [
      {
        type: 'RANGE_ADD',
        parentName: 'user',
        parentID: this.props.user.id,
        connectionName: 'posts',
        edgeName: 'postEdge',
        rangeBehaviors: {
          '': 'append',
        },
      },
    ]
  }

  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
  }
}
