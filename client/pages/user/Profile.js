import React from 'react';
import Relay from 'react-relay';

import { ROLES } from '../../../config';

const Profile = (props, context) => {
  const user = props.viewer.user;

  if (user.role === ROLES.anonymous) {
    context.router.push('/login');
    return <div/>;
  }
  else {
    return (
      <div>UserProfile for {user.firstName} {user.lastName}</div>
    )
  }
};

Profile.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default Relay.createContainer(Profile, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          firstName,
          lastName,
          role
        }
      }
    `
  }
});