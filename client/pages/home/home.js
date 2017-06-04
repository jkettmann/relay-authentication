import React from 'react'
import PropTypes from 'prop-types'
import Relay from 'react-relay/classic'

import styles from './home.css'

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

export default Relay.createContainer(HomePage, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          role
        }
      }
    `,
  },
})
