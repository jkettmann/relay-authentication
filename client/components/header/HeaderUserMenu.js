import React from 'react'
import PropTypes from 'prop-types'
import { createFragmentContainer, graphql } from 'react-relay'
import { routerShape } from 'found/lib/PropTypes'
import withRouter from 'found/lib/withRouter'

import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import PersonIcon from 'material-ui/svg-icons/social/person'
import MenuItem from 'material-ui/MenuItem'

import LogoutMutation from '../../mutation/LogoutMutation'

function onLogout(environment) {
  LogoutMutation.commit({
    environment,
    onCompleted: () =>
      // eslint-disable-next-line no-undef
      location.assign(`${location.protocol}//${location.host}`),
    onError: errors => console.error('logout failed', errors[0]),
  })
}

const HeaderUserMenu = ({ viewer, router, relay }) => {
  const {
    canPublish,
    isLoggedIn,
  } = viewer || {}

  const iconStyle = { fill: 'white' }

  if (canPublish) {
    return (
      <IconMenu
        iconButtonElement={<IconButton iconStyle={iconStyle}><PersonIcon /></IconButton>}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >

        <MenuItem primaryText="Profile" onClick={() => router.push('/user')} />

        <MenuItem
          primaryText="Create Post"
          onClick={() => router.push('/user/post/create')}
        />

        <MenuItem
          primaryText="My Posts"
          onClick={() => router.push('/user/posts')}
        />

        <MenuItem
          primaryText="Logout"
          onClick={() => onLogout(relay.environment)}
        />
      </IconMenu>
    )
  } else if (isLoggedIn) {
    return (
      <IconMenu
        iconButtonElement={<IconButton iconStyle={iconStyle}><PersonIcon /></IconButton>}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >

        <MenuItem primaryText="Profile" onClick={() => router.push('/user')} />

        <MenuItem
          primaryText="Logout"
          onClick={() => onLogout(relay.environment)}
        />

      </IconMenu>
    )
  }

  return (
    <IconButton onClick={() => router.push('/login')} iconStyle={iconStyle} >
      <PersonIcon />
    </IconButton>
  )
}

HeaderUserMenu.propTypes = {
  viewer: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
    canPublish: PropTypes.bool,
  }),
  relay: PropTypes.shape({
    environment: PropTypes.any.isRequired,
  }).isRequired,
  router: routerShape.isRequired,
}

HeaderUserMenu.defaultProps = {
  viewer: {},
}

export default createFragmentContainer(
  withRouter(HeaderUserMenu),
  graphql`
    fragment HeaderUserMenu_viewer on Viewer {
      isLoggedIn
      canPublish
      user {
        id
      }
    }
  `,
)
