import React from 'react'
import PropTypes from 'prop-types'

import GridList from 'material-ui/GridList'
import RaisedButton from 'material-ui/RaisedButton'

import PostListItem from './PostListItem'

const DEFAULT_ITEM_WIDTH = 400
const ITEM_PROPORTIONS = 0.75

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

class PostList extends React.Component {
  state = {
    width: 1000,
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    window.addEventListener('resize', this.setContainerWidth)
  }

  componentWillUnmount() {
    // eslint-disable-next-line no-undef
    window.removeEventListener('resize', this.setContainerWidth)
  }

  setContainerRef = (ref) => {
    this.container = ref
    this.setContainerWidth()
  }

  setContainerWidth = () => {
    if (this.container) {
      this.setState({ width: this.container.clientWidth })
    }
  }

  render() {
    const { posts, hasMore, onItemClick, onMore } = this.props
    const numCols = parseInt(this.state.width / DEFAULT_ITEM_WIDTH, 10) || 1
    const itemHeight = (this.state.width / numCols) * ITEM_PROPORTIONS

    return (
      <div ref={this.setContainerRef} style={styles.root}>
        <GridList
          style={styles.gridList}
          cellHeight={itemHeight}
          cols={numCols}
        >

          {
            posts.map(({ node }) => (
              <PostListItem
                key={node.id}
                post={node}
                onClick={() => onItemClick(node.id)}
              />
            ))
          }

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
    )
  }
}

PostList.propTypes = {
  onItemClick: PropTypes.func.isRequired,
  onMore: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
  ),
}

PostList.defaultProps = {
  posts: [],
}

export default PostList
