import React from 'react'
import PropTypes from 'prop-types'
import { routerShape } from 'found/lib/PropTypes'
import { createFragmentContainer, graphql } from 'react-relay'

const Profile = ({ viewer, router }) => {
  const user = viewer.user

  if (!user) {
    router.push('/login')
    return <div />
  }
  return <div>UserProfile for {user.firstName} {user.lastName}</div>
}

Profile.propTypes = {
  router: routerShape.isRequired,
  viewer: PropTypes.shape({
    user: PropTypes.shape({
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
      }
    }
  `,
)
