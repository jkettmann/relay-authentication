import React from 'react';
import Relay from 'react-relay';
import AppBar from 'material-ui/lib/app-bar';

import IconButton from 'material-ui/lib/icon-button';
import FlatButton from 'material-ui/lib/flat-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import PersonIcon from 'material-ui/lib/svg-icons/social/person';
import MenuItem from 'material-ui/lib/menus/menu-item';

import LogoutMutation from '../../../mutation/LogoutMutation';
import logout from '../../../common/logout';

import {ROLES} from '../../../../config';

function _logout (user) {
  logout(user,
    {
      onFailure: (transaction) => {
        console.log('onFailure');
        console.log(transaction.getError());
      },
      onSuccess: (response) => location.assign(location.protocol + '//' + location.host)
    }
  );
}

function getUserMenu (props, router) {
  const user = props.viewer.user;

  if (user.role === ROLES.publisher || user.role === ROLES.admin) {
    return (
      <IconMenu
        iconButtonElement={ <IconButton><PersonIcon /></IconButton> }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >

        <MenuItem
          primaryText="Profile"
          onClick={() => router.push('/user')} />

        <MenuItem
          primaryText="Create Post"
          onClick={() => router.push('/user/post/create')} />

        {user.posts.edges.length > 0 ?
          <MenuItem
            primaryText="My Posts"
            onClick={() => router.push('/user/posts')}/> :
          undefined
        }

        <MenuItem
          primaryText="Logout"
          onClick={() => _logout(user)} />

      </IconMenu>
    )
  }
  else if (user.role === ROLES.reader) {
    return (
      <IconMenu
        iconButtonElement={ <IconButton><PersonIcon /></IconButton> }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >

        <MenuItem
          primaryText="Profile"
          onClick={() => router.push('/user')} />

        <MenuItem
          primaryText="Logout"
          onClick={() => _logout(user)} />

      </IconMenu>
    );
  }
  else if (user.role === ROLES.anonymous) {
    return (
      <IconButton
        onClick={() => router.push('/login')}
      >
        <PersonIcon />
      </IconButton>
    )
  }
}

const Header = (props, context) => (
  <AppBar
    title="Relay Authentication"
    onLeftIconButtonTouchTap={props.toggleNavigation}
    iconElementRight={getUserMenu(props, context.router)}/>
);

Header.contextTypes = {
  router: React.PropTypes.object.isRequired,
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
  }
});

