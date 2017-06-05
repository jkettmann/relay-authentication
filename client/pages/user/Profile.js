import React from 'react'
import PropTypes from 'prop-types'
import { routerShape } from 'found/lib/PropTypes'
import Relay from 'react-relay/classic'

import { ROLES } from '../../../config'

const Profile = ({ viewer, router }) => {
  const user = viewer.user

  if (user.role === ROLES.anonymous) {
    router.push('/login')
    return <div />
  }
  return <div>UserProfile for {user.firstName} {user.lastName}</div>
}

Profile.propTypes = {
  router: routerShape.isRequired,
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
