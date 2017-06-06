import React from 'react'
import PropTypes from 'prop-types'
import { createFragmentContainer, graphql } from 'react-relay'

import styles from './Home.css'

const HomePage = ({ viewer }) =>
  <div className={styles.content}>
    <h1>User Authentication with Relay</h1>

    <div>
      You are currently {viewer.user.role === 'anonymous' && 'not'} logged in.
    </div>
  </div>

HomePage.propTypes = {
  viewer: PropTypes.shape({
    user: PropTypes.shape({
      role: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default createFragmentContainer(
  HomePage,
  graphql`
    fragment Home_viewer on Viewer {
      user {
        role
      }
    }
  `,
)
