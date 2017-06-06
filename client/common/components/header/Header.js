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

// import LogoutMutation from '../../../mutation/LogoutMutation'
import logout from '../../../common/logout'

import { ROLES } from '../../../../config'

function onLogout(user) {
  logout(user, {
    onFailure: transaction => {
      console.log('onFailure')
      console.log(transaction.getError())
    },
    // eslint-disable-next-line no-undef
    onSuccess: () => location.assign(`${location.protocol}//${location.host}`),
  })
}

function getUserMenu(user = {}, navigateTo) {
  if (user.role === ROLES.publisher || user.role === ROLES.admin) {
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

        <MenuItem primaryText="Logout" onClick={() => onLogout(user)} />
      </IconMenu>
    )
  } else if (user.role === ROLES.reader) {
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

  return (
    <IconButton onClick={() => navigateTo('/login')}>
      <PersonIcon />
    </IconButton>
  )
}

const Header = ({ user, toggleNavigation, router }) =>
  <AppBar
    title="Relay Authentication"
    onLeftIconButtonTouchTap={toggleNavigation}
    iconElementRight={getUserMenu(user, router.push)}
  />

Header.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    role: PropTypes.string.isRequired,
    postCount: PropTypes.number,
  }).isRequired,
  router: routerShape.isRequired,
  toggleNavigation: PropTypes.func.isRequired,
}

export default createFragmentContainer(
  withRouter(Header),
  graphql`
    fragment Header_user on User {
      firstName
      lastName
      role
      postCount
    }
  `,
)
