import React from 'react';

import GridTile from 'material-ui/lib/grid-list/grid-tile';

export default (props) => (
  <GridTile
    title={ props.title }
    onClick={() => props.onClick()}
  >
    <img src={props.image}/>
  </GridTile>
);