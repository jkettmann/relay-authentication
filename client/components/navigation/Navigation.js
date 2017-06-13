import React from 'react'
import PropTypes from 'prop-types'
import { createFragmentContainer, graphql } from 'react-relay'

import Drawer from 'material-ui/Drawer'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'

import UserMenu from './NavigationUserMenu'

const Navigation = ({ open, close, viewer, navigateTo }) => (
  <Drawer open={open}>
    <IconButton onClick={close}>
      <NavigationClose />
    </IconButton>

    <Divider />

    <UserMenu viewer={viewer} navigateTo={navigateTo} />

    <Divider />

    <MenuItem onClick={() => navigateTo('/posts')}>Posts</MenuItem>
  </Drawer>
)

Navigation.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  viewer: PropTypes.object,
}

Navigation.defaultProps = {
  viewer: {},
}

export default createFragmentContainer(
  Navigation,
  graphql`
    fragment Navigation_viewer on Viewer {
      ...NavigationUserMenu_viewer
    }
  `,
)
