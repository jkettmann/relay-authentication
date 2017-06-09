import React from 'react'
import PropTypes from 'prop-types'
import { routerShape } from 'found/lib/PropTypes'
import { createPaginationContainer, graphql } from 'react-relay'

import PostList from '../../components/post/PostList'

export const POST_COUNT = 6

const UserPosts = ({ viewer, relay, router }) => {
  if (!viewer.isLoggedIn) {
    router.push('/login')
    return <div />
  }

  if (!viewer.canPublish) {
    this.props.router.push('/')
    return <div />
  }

  return (
    <div>
      <PostList
        posts={viewer.user.posts.edges}
        hasMore={relay.hasMore()}
        onItemClick={id => router.push(`/post/${id}`)}
        onMore={() => relay.isLoading() || relay.loadMore(POST_COUNT)}
      />
    </div>
  )
}

UserPosts.propTypes = {
  relay: PropTypes.shape({
    hasMore: PropTypes.func.isRequired,
    isLoading: PropTypes.func.isRequired,
    loadMore: PropTypes.func.isRequired,
  }).isRequired,
  router: routerShape.isRequired,
  viewer: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
    canPublish: PropTypes.bool,
    user: PropTypes.shape({
      posts: PropTypes.shape({
        edges: PropTypes.array,
      }),
    }),
  }).isRequired,
}

export default createPaginationContainer(
  UserPosts,
  graphql`
    fragment UserPosts_viewer on Viewer {
      isLoggedIn
      canPublish
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
