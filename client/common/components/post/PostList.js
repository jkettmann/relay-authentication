import React from 'react'
import PropTypes from 'prop-types'
import Relay from 'react-relay/classic'

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

const PostList = ({ posts, onItemClick, onMore }) =>
  <div style={styles.root}>
    <GridList cellHeight={300} style={styles.gridList}>

      {posts.edges.map(({ node }) =>
        <PostListItem
          key={node.id}
          post={node}
          onClick={() => onItemClick(node.id)}
        />,
      )}

    </GridList>

    {posts.pageInfo.hasNextPage &&
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
  posts: PropTypes.shape({
    pageInfo: PropTypes.shape({
      hasNextPage: PropTypes.bool.isRequired,
    }),
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        node: PropTypes.shape({
          id: PropTypes.string,
        }),
      }),
    ),
  }),
}

PostList.defaultProps = {
  posts: [],
}

export default Relay.createContainer(PostList, {
  fragments: {
    posts: () => Relay.QL`
      fragment on PostConnection {
        pageInfo {
          hasNextPage
        }
        edges {
          node {
            id
            ${PostListItem.getFragment('post')}
          }
        }
      }
    `,
  },
})
