import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import PropTypes from 'prop-types'

import GridTile from 'material-ui/GridList/GridTile'

const PostListItem = ({ post, onClick }) => (
  <GridTile style={{ cursor: 'pointer' }} title={post.title} onClick={onClick}>
    <img
      style={{ width: '100%', height: '100%' }}
      src={post.image}
      alt={post.title}
    />
  </GridTile>
)

PostListItem.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default createFragmentContainer(
  PostListItem,
  graphql`
    fragment PostListItem_post on Post {
      title
      image
    }
  `,
)
