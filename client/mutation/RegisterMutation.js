import Relay from 'react-relay/classic'

export default class RegisterMutation extends Relay.Mutation {
  // eslint-disable-next-line class-methods-use-this
  getMutation() {
    return Relay.QL`mutation { register }`
  }

  getVariables() {
    return {
      email: this.props.email,
      password: this.props.password,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      role: this.props.role,
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getFatQuery() {
    return Relay.QL`
      fragment on RegisterPayload {
        user
      }
    `
  }

  // eslint-disable-next-line class-methods-use-this
  getConfigs() {
    return []
  }

  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  }
}
