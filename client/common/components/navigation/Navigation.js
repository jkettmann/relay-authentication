import React from 'react'
import PropTypes from 'prop-types'
import { createFragmentContainer, graphql } from 'react-relay'

import Drawer from 'material-ui/Drawer'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'

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

function getAccountMenu(user, navigateTo, relayEnvironment) {
  if (!user || user.role === ROLES.anonymous) {
    return <MenuItem onClick={() => navigateTo('/login')}>Login</MenuItem>
  }

  return (
    <span>
      <MenuItem onClick={() => navigateTo('/user')}>
        Profile
      </MenuItem>

      <MenuItem onClick={() => navigateTo('/user/post/create')}>
        Create Post
      </MenuItem>

      {user.postCount > 0 &&
        <MenuItem onClick={() => navigateTo('/user/posts')}>
          My Posts
        </MenuItem>}

      <MenuItem onClick={() => onLogout(relayEnvironment)}>
        Logout
      </MenuItem>
    </span>
  )
}

const Navigation = ({ open, close, user, navigateTo, relay }) =>
  <Drawer open={open}>
    <IconButton onClick={close}>
      <NavigationClose />
    </IconButton>

    <Divider />

    {getAccountMenu(user || {}, navigateTo, relay.environment)}

    <Divider />

    <MenuItem onClick={() => navigateTo('/posts')}>Posts</MenuItem>
  </Drawer>

Navigation.propTypes = {
  relay: PropTypes.shape({
    environment: PropTypes.any.isRequired,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
  user: PropTypes.shape({
    postCount: PropTypes.number,
    role: PropTypes.string,
  }),
}

Navigation.defaultProps = {
  user: {},
}

export default createFragmentContainer(
  Navigation,
  graphql`
    fragment Navigation_user on User {
      firstName
      role
      postCount
    }
  `,
)
