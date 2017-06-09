import React from 'react'
import PropTypes from 'prop-types'
import { createFragmentContainer, graphql } from 'react-relay'
import { routerShape } from 'found/lib/PropTypes'
import withRouter from 'found/lib/withRouter'
import Link from 'found/lib/Link'
import AppBar from 'material-ui/AppBar'

import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import PersonIcon from 'material-ui/svg-icons/social/person'
import MenuItem from 'material-ui/MenuItem'

import LogoutMutation from '../../mutation/LogoutMutation'

import styles from './Header.css'

function onLogout(environment) {
  LogoutMutation.commit({
    environment,
    onCompleted: () =>
      // eslint-disable-next-line no-undef
      location.assign(`${location.protocol}//${location.host}`),
    onError: error => {
      console.log('logout failed')
      console.log(error)
    },
  })
}

function getUserMenu(viewer, navigateTo, relayEnvironment) {
  if (viewer.canPublish) {
    return (
      <IconMenu
        iconButtonElement={<IconButton><PersonIcon /></IconButton>}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >

        <MenuItem primaryText="Profile" onClick={() => navigateTo('/user')} />

        <MenuItem
          primaryText="Create Post"
          onClick={() => navigateTo('/user/post/create')}
        />

        <MenuItem
          primaryText="My Posts"
          onClick={() => navigateTo('/user/posts')}
        />

        <MenuItem
          primaryText="Logout"
          onClick={() => onLogout(relayEnvironment)}
        />
      </IconMenu>
    )
  } else if (viewer.isLoggedIn) {
    return (
      <IconMenu
        iconButtonElement={<IconButton><PersonIcon /></IconButton>}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >

        <MenuItem primaryText="Profile" onClick={() => navigateTo('/user')} />

        <MenuItem
          primaryText="Logout"
          onClick={() => onLogout(relayEnvironment)}
        />

      </IconMenu>
    )
  }

  return (
    <IconButton onClick={() => navigateTo('/login')}>
      <PersonIcon />
    </IconButton>
  )
}

const Header = ({ viewer, toggleNavigation, relay, router }) =>
  <AppBar
    title={<Link className={styles.title} to="/">Relay Authentication</Link>}
    onLeftIconButtonTouchTap={toggleNavigation}
    iconElementRight={getUserMenu(viewer || {}, router.push, relay.environment)}
  />

Header.propTypes = {
  viewer: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
    canPublish: PropTypes.bool,
  }),
  relay: PropTypes.shape({
    environment: PropTypes.any.isRequired,
  }).isRequired,
  router: routerShape.isRequired,
  toggleNavigation: PropTypes.func.isRequired,
}

Header.defaultProps = {
  viewer: {},
}

export default createFragmentContainer(
  withRouter(Header),
  graphql`
    fragment Header_viewer on Viewer {
      isLoggedIn
      canPublish
    }
  `,
)
