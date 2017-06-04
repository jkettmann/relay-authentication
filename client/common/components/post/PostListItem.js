import React from 'react'
import PropTypes from 'prop-types'

import GridTile from 'material-ui/GridList/GridTile'

const PostListItem = props =>
  <GridTile title={props.title} onClick={props.onClick}>
    <img src={props.image} alt={props.title} />
  </GridTile>

PostListItem.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default PostListItem
