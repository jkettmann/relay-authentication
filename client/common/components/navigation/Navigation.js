import React from 'react';
import Relay from 'react-relay';

import LeftNav from 'material-ui/lib/left-nav';
import IconButton from 'material-ui/lib/icon-button';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';

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

function getAccountMenu (props) {
  const user = props.viewer.user;
  if (user.role === ROLES.anonymous) {
    return <MenuItem onClick={() => props.navigateTo('/login')}>Login</MenuItem>;
  }
  else {
    const hasPosts = user.posts.edges.length > 0;
    return (
      <span>
        <MenuItem
          onClick={() => props.navigateTo('/user')}
        >
          Profile
        </MenuItem>

        <MenuItem
          onClick={() => props.navigateTo('/user/post/create')}
        >
          Create Post
        </MenuItem>

        {
          hasPosts ?
            <MenuItem
              onClick={() => props.navigateTo('/user/posts')}
            >
              My Posts
            </MenuItem> :
            undefined
        }

        <MenuItem
          onClick={() => _logout(user)}
        >
          Logout
        </MenuItem>
      </span>
    )
  }
}

const Navigation = (props) => (
  <LeftNav open={props.open}>
    <IconButton onClick={() => props.close()}>
      <NavigationClose />
    </IconButton>

    <Divider />

    {getAccountMenu(props)}

    <Divider />

    <MenuItem onClick={() => props.navigateTo('/posts')}>Posts</MenuItem>
  </LeftNav>
);

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
  }
});