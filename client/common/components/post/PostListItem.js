import React from 'react'
import Relay from 'react-relay/classic'
import PropTypes from 'prop-types'

import GridTile from 'material-ui/GridList/GridTile'

const PostListItem = ({ post, onClick }) =>
  <GridTile title={post.title} onClick={onClick}>
    <img src={post.image} alt={post.title} />
  </GridTile>

PostListItem.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Relay.createContainer(PostListItem, {
  fragments: {
    post: () => Relay.QL`
      fragment on Post {
        title
        image
      }
    `,
  },
})
