import React from 'react';
import Relay from 'react-relay';

import PostList from '../../common/components/post/PostList';

class Posts extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  render () {
    return (
      <div>
        <PostList
          items={this.props.viewer.posts.edges}
          onItemClick={(id) => this.context.router.push(`/post/${id}`)} />
      </div>
    );
  }

}

export default Relay.createContainer(Posts, {
  fragments: {
  viewer: () => Relay.QL`
    fragment on Viewer {
      posts (first: 20) {
        edges {
          node {
            id,
            creatorId,
            title
            image,
          }
        }
      }
    }
  `,
},
});