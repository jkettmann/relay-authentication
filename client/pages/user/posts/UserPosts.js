import React from 'react'
import PropTypes from 'prop-types'
import Relay from 'react-relay'

import PostList from '../../../common/components/post/PostList'
import { ROLES } from '../../../../config'

const UserPosts = ({ viewer }, context) => {
  const user = viewer.user

  if (user.role === ROLES.anonymous) {
    context.router.push('/login')
    return <div />
  }
  return (
    <div>
      <PostList
        items={user.posts.edges}
        onItemClick={id => context.router.push(`/post/${id}`)}
      />
    </div>
  )
}

UserPosts.contextTypes = {
  router: PropTypes.object.isRequired,
}

UserPosts.propTypes = {
  viewer: PropTypes.shape({
    user: PropTypes.shape({
      role: PropTypes.string,
      posts: PropTypes.shape({
        edges: PropTypes.array,
      }),
    }),
  }).isRequired,
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
})
