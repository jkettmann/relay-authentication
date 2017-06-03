import React from 'react'
import PropTypes from 'prop-types'
import Relay from 'react-relay'

import PostList from '../../common/components/post/PostList'

const Posts = ({ viewer }, context) =>
  (<div>
    <PostList
      items={viewer.posts.edges}
      onItemClick={id => context.router.push(`/post/${id}`)}
    />
  </div>)

Posts.contextTypes = {
  router: PropTypes.object.isRequired,
}

Posts.propTypes = {
  viewer: PropTypes.shape({
    posts: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }).isRequired,
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
})
