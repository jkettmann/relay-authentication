import React from 'react'
import PropTypes from 'prop-types'

import GridList from 'material-ui/GridList'
import RaisedButton from 'material-ui/RaisedButton'

import PostListItem from './PostListItem'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingBottom: 10,
  },
  gridList: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    marginTop: 4,
  },
}

const PostList = ({ items, hasMore, onItemClick, onMore }) =>
  <div style={styles.root}>
    <GridList cellHeight={300} style={styles.gridList}>

      {items.map(post =>
        <PostListItem
          key={post.node.id}
          {...post.node}
          onClick={() => onItemClick(post.node.id)}
        />,
      )}

    </GridList>

    {hasMore &&
      <div
        style={{
          marginTop: 15,
          width: '100%',
          maxWidth: 400,
          padding: '0 2px 0',
        }}
      >
        <RaisedButton label="More" onClick={onMore} secondary fullWidth />
      </div>}
  </div>

PostList.propTypes = {
  onItemClick: PropTypes.func.isRequired,
  onMore: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
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
