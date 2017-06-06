import React from 'react'
import PropTypes from 'prop-types'
import { createFragmentContainer, graphql } from 'react-relay'

const PostDetail = props =>
  <div>
    {props.viewer.post.title}<br />
    {props.viewer.post.description}
  </div>

PostDetail.propTypes = {
  viewer: PropTypes.shape({
    post: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  }).isRequired,
}

export default createFragmentContainer(
  PostDetail,
  graphql`
    fragment PostDetail_viewer on Viewer {
      post (postId: $postId) {
        title,
        description
      }
    }
  `,
)
