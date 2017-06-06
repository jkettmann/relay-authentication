import React from 'react'
import PropTypes from 'prop-types'
import { routerShape } from 'found/lib/PropTypes'
import { createPaginationContainer, graphql } from 'react-relay'

import PostList from '../../../common/components/post/PostList'
import { ROLES } from '../../../../config'

const POST_NUM_LIMIT = 6

const UserPosts = ({ viewer, relay, router }) => {
  const user = viewer.user

  if (user.role === ROLES.anonymous) {
    router.push('/login')
    return <div />
  }
  return (
    <div>
      <PostList
        posts={user.posts}
        onItemClick={id => router.push(`/post/${id}`)}
        onMore={() =>
          relay.setVariables({ limit: relay.variables.limit + POST_NUM_LIMIT })}
      />
    </div>
  )
}

UserPosts.propTypes = {
  relay: PropTypes.shape({
    setVariables: PropTypes.func.isRequired,
    variables: PropTypes.shape({
      limit: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  router: routerShape.isRequired,
  viewer: PropTypes.shape({
    user: PropTypes.shape({
      role: PropTypes.string,
      posts: PropTypes.any,
    }),
  }).isRequired,
}

export default createPaginationContainer(
  UserPosts,
  graphql`
    fragment UserPosts_viewer on Viewer {
      user {
        posts (after: $afterCursor first: $count) @connection(key: "UserPosts_posts") {
          pageInfo {
            hasNextPage
            endCursor
          },
          edges {
            node {
              id
              ...PostListItem_post
            }
          }
        }
      }
    }
  `,
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.viewer && props.viewer.user && props.viewer.user.posts
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }) {
      return {
        afterCursor: cursor,
        count,
      }
    },
    query: graphql`
      query UserPostsPaginationQuery($afterCursor: String, $count: Int!) {
        viewer {
          ...UserPosts_viewer
        }
      }
    `,
  },
)
