import Relay from 'react-relay/classic'

export default class LoginMutation extends Relay.Mutation {
  // eslint-disable-next-line class-methods-use-this
  getMutation() {
    return Relay.QL`mutation { login }`
  }

  getVariables() {
    return {
      email: this.props.email,
      password: this.props.password,
      id: this.props.user.id,
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getFatQuery() {
    return Relay.QL`
      fragment on LoginPayload {
        user
      }
    `
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          user: this.props.user.id,
        },
      },
    ]
  }

  static fragments = {
    // props have to contain user data with fragments key name 'user'
    user: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
  }
}
