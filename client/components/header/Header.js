import React from 'react'
import PropTypes from 'prop-types'
import { createFragmentContainer, graphql } from 'react-relay'
import Link from 'found/lib/Link'
import AppBar from 'material-ui/AppBar'

import UserMenu from './HeaderUserMenu'

import styles from './Header.css'

const Header = ({ viewer, toggleNavigation }) => (
  <AppBar
    title={<Link className={styles.title} to="/">Relay Authentication</Link>}
    onLeftIconButtonTouchTap={toggleNavigation}
    iconElementRight={<UserMenu viewer={viewer} />}
  />
)

Header.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  viewer: PropTypes.object,
  toggleNavigation: PropTypes.func.isRequired,
}

Header.defaultProps = {
  viewer: null,
}

export default createFragmentContainer(
  Header,
  graphql`
    fragment Header_viewer on Viewer {
      ...HeaderUserMenu_viewer
    }
  `,
)
