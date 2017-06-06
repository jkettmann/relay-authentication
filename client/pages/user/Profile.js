import React from 'react'
import PropTypes from 'prop-types'
import { routerShape } from 'found/lib/PropTypes'
import { createFragmentContainer, graphql } from 'react-relay'

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

export default createFragmentContainer(
  Profile,
  graphql`
    fragment Profile_viewer on Viewer {
      user {
        firstName,
        lastName,
        role
      }
    }
  `,
)
