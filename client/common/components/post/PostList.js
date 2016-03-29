import React from 'react';

import GridList from 'material-ui/lib/grid-list/grid-list';

import PostListItem from './PostListItem'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: "100%",
    height: "100%",
    overflowY: 'auto',
    marginBottom: 40,
  },
};

export default (props) => (
  <div
    style={styles.root}
  >
    <GridList
      cellHeight={300}
      style={styles.gridList}
    >

      {
        props.items.map(post =>
          <PostListItem
            key={post.node.id}
            {...post.node}
            onClick={() => props.onItemClick(post.node.id)} />
        )
      }

    </GridList>
  </div>
);
