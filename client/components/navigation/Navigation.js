import React from 'react'
import PropTypes from 'prop-types'
import { createFragmentContainer, graphql } from 'react-relay'

import Drawer from 'material-ui/Drawer'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'

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

function getAccountMenu(viewer, navigateTo, relayEnvironment) {
  if (viewer.canPublish) {
    return (
      <span>
        <MenuItem onClick={() => navigateTo('/user')}>
          Profile
        </MenuItem>

        <MenuItem onClick={() => navigateTo('/user/post/create')}>
          Create Post
        </MenuItem>

        <MenuItem onClick={() => navigateTo('/user/posts')}>
          My Posts
        </MenuItem>

        <MenuItem onClick={() => onLogout(relayEnvironment)}>
          Logout
        </MenuItem>
      </span>
    )
  } else if (viewer.isLoggedIn) {
    return (
      <span>
        <MenuItem onClick={() => navigateTo('/user')}>
          Profile
        </MenuItem>

        <MenuItem onClick={() => onLogout(relayEnvironment)}>
          Logout
        </MenuItem>
      </span>
    )
  }

  return <MenuItem onClick={() => navigateTo('/login')}>Login</MenuItem>
}

const Navigation = ({ open, close, viewer, navigateTo, relay }) => (
  <Drawer open={open}>
    <IconButton onClick={close}>
      <NavigationClose />
    </IconButton>

    <Divider />

    {getAccountMenu(viewer || {}, navigateTo, relay.environment)}

    <Divider />

    <MenuItem onClick={() => navigateTo('/posts')}>Posts</MenuItem>
  </Drawer>
)

Navigation.propTypes = {
  relay: PropTypes.shape({
    environment: PropTypes.any.isRequired,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
  viewer: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
    canPublish: PropTypes.bool,
  }),
}

Navigation.defaultProps = {
  viewer: {},
}

export default createFragmentContainer(
  Navigation,
  graphql`
    fragment Navigation_viewer on Viewer {
      isLoggedIn
      canPublish
    }
  `,
)
