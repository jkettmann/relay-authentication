import React from 'react';
import Relay from 'react-relay';

import PostList from '../../../common/components/post/PostList';
import { ROLES } from '../../../../config';

class UserPosts extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  render () {
    const user = this.props.viewer.user;
    if (user.role === ROLES.anonymous) {
      this.context.router.push('/login');
      return <div/>;
    }
    else {
      return (
        <div>
          <PostList items={user.posts.edges}
                    onItemClick={(id) => this.context.router.push(`/post/${id}`)} />
        </div>
      );
    }
  }

}

export default Relay.createContainer(UserPosts, {
  fragments: {
    viewer: () => Relay.QL`
    fragment on Viewer {
      user {
        userId,
        role,
        posts (first: 20) {
          edges {
            node {
              id,
              creatorId,
              title,
              image,
            }
          }
        }
      }
    }
  `,
  },
});