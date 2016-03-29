import Relay from 'react-relay';

export default class RegisterMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation { register }`;
  }

  getVariables () {
    return {
      email: this.props.email,
      password: this.props.password,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      role: this.props.role
    }
  }

  getFatQuery () {
    return Relay.QL`
      fragment on RegisterPayload {
        user {
          id
        }
      }
    `;
  }

  getConfigs () {
    return [];
  }

  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
      }
    `
  }
}