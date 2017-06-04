import React from 'react'
import PropTypes from 'prop-types'
import Relay from 'react-relay/classic'
import AppBar from 'material-ui/AppBar'

import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import PersonIcon from 'material-ui/svg-icons/social/person'
import MenuItem from 'material-ui/MenuItem'

import LogoutMutation from '../../../mutation/LogoutMutation'
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

function getUserMenu(user, router) {
  if (user.role === ROLES.publisher || user.role === ROLES.admin) {
    return (
      <IconMenu
        iconButtonElement={<IconButton><PersonIcon /></IconButton>}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >

        <MenuItem primaryText="Profile" onClick={() => router.push('/user')} />

        <MenuItem
          primaryText="Create Post"
          onClick={() => router.push('/user/post/create')}
        />

        {user.posts.edges.length > 0
          ? <MenuItem
              primaryText="My Posts"
              onClick={() => router.push('/user/posts')}
            />
          : undefined}

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

        <MenuItem primaryText="Profile" onClick={() => router.push('/user')} />

        <MenuItem primaryText="Logout" onClick={() => onLogout(user)} />

      </IconMenu>
    )
  }

  return (
    <IconButton onClick={() => router.push('/login')}>
      <PersonIcon />
    </IconButton>
  )
}

const Header = (props, context) =>
  <AppBar
    title="Relay Authentication"
    onLeftIconButtonTouchTap={props.toggleNavigation}
    iconElementRight={getUserMenu(props.viewer.user || {}, context.router)}
  />

Header.contextTypes = {
  router: PropTypes.object.isRequired,
}

Header.propTypes = {
  viewer: PropTypes.shape({
    user: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      role: PropTypes.string.isRequired,
      posts: PropTypes.shape({
        edges: PropTypes.array,
      }),
    }).isRequired,
  }).isRequired,
  toggleNavigation: PropTypes.func.isRequired,
}

export default Relay.createContainer(Header, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          firstName,
          lastName,
          role,
          posts (first: 1) {
            edges
          },
          ${LogoutMutation.getFragment('user')}
        },
      }
    `,
  },
})
