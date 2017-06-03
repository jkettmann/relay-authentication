import React from 'react'
import PropTypes from 'prop-types'
import Relay from 'react-relay'

import styles from './home.css'

const HomePage = () =>
  (<div className={styles.content}>
    <h2>Home</h2>
  </div>)

HomePage.contextTypes = {
  router: PropTypes.object.isRequired,
}

export default Relay.createContainer(HomePage, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id,
        }
      }
    `,
  },
})
