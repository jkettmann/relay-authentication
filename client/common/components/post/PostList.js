import React from 'react'
import PropTypes from 'prop-types'

import GridList from 'material-ui/GridList'

import PostListItem from './PostListItem'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    marginBottom: 40,
  },
}

const PostList = ({ items, onItemClick }) =>
  <div style={styles.root}>
    <GridList cellHeight={300} style={styles.gridList}>

      {items.map(post =>
        (<PostListItem
          key={post.node.id}
          {...post.node}
          onClick={() => onItemClick(post.node.id)}
        />),
      )}

    </GridList>
  </div>

PostList.propTypes = {
  onItemClick: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
  ),
}

PostList.defaultProps = {
  items: [],
}

export default PostList
