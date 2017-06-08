import React from 'react'
import PropTypes from 'prop-types'
import { createFragmentContainer, graphql } from 'react-relay'
import { routerShape } from 'found/lib/PropTypes'
import withRouter from 'found/lib/withRouter'
import AppBar from 'material-ui/AppBar'

import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import PersonIcon from 'material-ui/svg-icons/social/person'
import MenuItem from 'material-ui/MenuItem'

import LogoutMutation from '../../../mutation/LogoutMutation'

import { ROLES } from '../../../../config'

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

function getUserMenu(user = {}, navigateTo, relayEnvironment) {
  if (!user || user.role === ROLES.anonymous) {
    return (
      <IconButton onClick={() => navigateTo('/login')}>
        <PersonIcon />
      </IconButton>
    )
  } else if (user.role === ROLES.publisher || user.role === ROLES.admin) {
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

        {user.postCount &&
          <MenuItem
            primaryText="My Posts"
            onClick={() => navigateTo('/user/posts')}
          />}

        <MenuItem
          primaryText="Logout"
          onClick={() => onLogout(relayEnvironment)}
        />
      </IconMenu>
    )
  }

  // reader role
  return (
    <IconMenu
      iconButtonElement={<IconButton><PersonIcon /></IconButton>}
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
    >

      <MenuItem primaryText="Profile" onClick={() => navigateTo('/user')} />

      <MenuItem primaryText="Logout" onClick={() => onLogout(user)} />

    </IconMenu>
  )
}

const Header = ({ user, toggleNavigation, relay, router }) =>
  <AppBar
    title="Relay Authentication"
    onLeftIconButtonTouchTap={toggleNavigation}
    iconElementRight={getUserMenu(user, router.push, relay.environment)}
  />

Header.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,
    postCount: PropTypes.number,
  }),
  relay: PropTypes.shape({
    environment: PropTypes.any.isRequired,
  }).isRequired,
  router: routerShape.isRequired,
  toggleNavigation: PropTypes.func.isRequired,
}

Header.defaultProps = {
  user: {},
}

export default createFragmentContainer(
  withRouter(Header),
  graphql`
    fragment Header_user on User {
      role
      postCount
    }
  `,
)
