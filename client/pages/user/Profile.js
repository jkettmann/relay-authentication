import React from 'react'
import PropTypes from 'prop-types'
import Relay from 'react-relay'

import { ROLES } from '../../../config'

const Profile = (props, context) => {
  const user = props.viewer.user

  if (user.role === ROLES.anonymous) {
    context.router.push('/login')
    return <div />
  }
  return <div>UserProfile for {user.firstName} {user.lastName}</div>
}

Profile.contextTypes = {
  router: PropTypes.object.isRequired,
}

Profile.propTypes = {
  viewer: PropTypes.shape({
    user: PropTypes.shape({
      role: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }),
  }).isRequired,
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
    `,
  },
})
