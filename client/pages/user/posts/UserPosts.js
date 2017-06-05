import React from 'react'
import PropTypes from 'prop-types'
import Relay from 'react-relay/classic'

import PostList from '../../../common/components/post/PostList'
import { ROLES } from '../../../../config'

const POST_NUM_LIMIT = 6

const UserPosts = ({ viewer, relay }, context) => {
  const user = viewer.user

  if (user.role === ROLES.anonymous) {
    context.router.push('/login')
    return <div />
  }
  return (
    <div>
      <PostList
        posts={user.posts}
        onItemClick={id => context.router.push(`/post/${id}`)}
        onMore={() =>
          relay.setVariables({ limit: relay.variables.limit + POST_NUM_LIMIT })}
      />
    </div>
  )
}

UserPosts.contextTypes = {
  router: PropTypes.object.isRequired,
}

UserPosts.propTypes = {
  relay: PropTypes.shape({
    setVariables: PropTypes.func.isRequired,
    variables: PropTypes.shape({
      limit: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  viewer: PropTypes.shape({
    user: PropTypes.shape({
      role: PropTypes.string,
      posts: PropTypes.any,
    }),
  }).isRequired,
}

export default Relay.createContainer(UserPosts, {
  initialVariables: {
    limit: POST_NUM_LIMIT,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          role,
          posts (first: $limit) {
            ${PostList.getFragment('posts')}
          }
        }
      }
    `,
  },
})
