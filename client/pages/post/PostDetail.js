import React from 'react'
import PropTypes from 'prop-types'
import { createFragmentContainer, graphql } from 'react-relay'

import styles from './PostDetail.css'

const PostDetail = ({ viewer }) => (
  <div>
    <img
      className={styles.image}
      src={viewer.post.image}
      alt={viewer.post.title}
    />

    <div className={styles.container}>
      <h1 className={styles.title}>{viewer.post.title}</h1>
      <div className={styles.user}>
        by {viewer.post.creator.firstName} {viewer.post.creator.lastName}
      </div>

      <div>{viewer.post.description}</div>
    </div>
  </div>
)

PostDetail.propTypes = {
  viewer: PropTypes.shape({
    post: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      creator: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
      }).isRequired,
    }),
  }).isRequired,
}

export default createFragmentContainer(
  PostDetail,
  graphql`
    fragment PostDetail_viewer on Viewer {
      post (postId: $postId) {
        title
        description
        image
        creator {
          firstName
          lastName
        }
      }
    }
  `,
)
