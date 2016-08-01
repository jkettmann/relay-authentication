import React from 'react';

import GridTile from 'material-ui/GridList/GridTile';

export default (props) => (
  <GridTile
    title={ props.title }
    onClick={() => props.onClick()}
  >
    <img src={props.image}/>
  </GridTile>
);