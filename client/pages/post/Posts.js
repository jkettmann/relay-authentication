import React from 'react'
import PropTypes from 'prop-types'
import Relay from 'react-relay/classic'

import PostList from '../../common/components/post/PostList'

const POST_NUM_LIMIT = 6

const Posts = ({ viewer, relay }, context) =>
  <div>
    <PostList
      posts={viewer.posts}
      onItemClick={id => context.router.push(`/post/${id}`)}
      onMore={() =>
        relay.setVariables({ limit: relay.variables.limit + POST_NUM_LIMIT })}
    />
  </div>

Posts.contextTypes = {
  router: PropTypes.object.isRequired,
}

Posts.propTypes = {
  relay: PropTypes.shape({
    setVariables: PropTypes.func.isRequired,
    variables: PropTypes.shape({
      limit: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  viewer: PropTypes.shape({
    posts: PropTypes.any,
  }).isRequired,
}

export default Relay.createContainer(Posts, {
  initialVariables: {
    limit: POST_NUM_LIMIT,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        posts (first: $limit) {
          ${PostList.getFragment('posts')}
        }
      }
    `,
  },
})
