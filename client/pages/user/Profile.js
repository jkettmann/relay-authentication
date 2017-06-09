import React from 'react'
import PropTypes from 'prop-types'
import { routerShape } from 'found/lib/PropTypes'
import { createFragmentContainer, graphql } from 'react-relay'

import styles from './Profile.css'

const Profile = ({ viewer, router }) => {
  const user = viewer.user

  if (!user) {
    router.push('/login')
    return <div />
  }
  return (
    <div className={styles.container}>
      <h2>Your Account</h2>
      <div>{user.firstName} {user.lastName}</div>
      <div>{user.email}</div>
    </div>
  )
}

Profile.propTypes = {
  router: routerShape.isRequired,
  viewer: PropTypes.shape({
    user: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }),
  }).isRequired,
}

export default createFragmentContainer(
  Profile,
  graphql`
    fragment Profile_viewer on Viewer {
      user {
        firstName
        lastName
        email
      }
    }
  `,
)
