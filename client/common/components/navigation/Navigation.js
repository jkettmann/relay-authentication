import React from 'react'
import PropTypes from 'prop-types'
import Relay from 'react-relay/classic'

import Drawer from 'material-ui/Drawer'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'

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

function getAccountMenu(user, navigateTo) {
  if (user.role === ROLES.anonymous) {
    return <MenuItem onClick={() => navigateTo('/login')}>Login</MenuItem>
  }
  const hasPosts = user.posts ? user.posts.edges.length > 0 : false
  return (
    <span>
      <MenuItem onClick={() => navigateTo('/user')}>
        Profile
      </MenuItem>

      <MenuItem onClick={() => navigateTo('/user/post/create')}>
        Create Post
      </MenuItem>

      {hasPosts
        ? <MenuItem onClick={() => navigateTo('/user/posts')}>
            My Posts
          </MenuItem>
        : undefined}

      <MenuItem onClick={() => onLogout(user)}>
        Logout
      </MenuItem>
    </span>
  )
}

const Navigation = props =>
  <Drawer open={props.open}>
    <IconButton onClick={props.close}>
      <NavigationClose />
    </IconButton>

    <Divider />

    {getAccountMenu(props.viewer.user || {}, props.navigateTo)}

    <Divider />

    <MenuItem onClick={() => props.navigateTo('/posts')}>Posts</MenuItem>
  </Drawer>

Navigation.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
  viewer: PropTypes.shape({
    user: PropTypes.shape({
      role: PropTypes.string,
    }),
  }).isRequired,
}

export default Relay.createContainer(Navigation, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          firstName,
          role,
          posts (first: 1) {
            edges
          }
          ${LogoutMutation.getFragment('user')}
        }
      }
    `,
  },
})
