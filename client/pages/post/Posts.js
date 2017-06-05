import React from 'react'
import PropTypes from 'prop-types'
import { routerShape } from 'found/lib/PropTypes'
import Relay from 'react-relay/classic'

import PostList from '../../common/components/post/PostList'

const POST_NUM_LIMIT = 6

const Posts = ({ viewer, relay, router }) =>
  <div>
    <PostList
      posts={viewer.posts}
      onItemClick={id => router.push(`/post/${id}`)}
      onMore={() =>
        relay.setVariables({ limit: relay.variables.limit + POST_NUM_LIMIT })}
    />
  </div>

Posts.propTypes = {
  relay: PropTypes.shape({
    setVariables: PropTypes.func.isRequired,
    variables: PropTypes.shape({
      limit: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  router: routerShape.isRequired,
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
