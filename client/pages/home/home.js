import React from "react";
import Relay from 'react-relay';

import styles from "./home.css";


export class HomePage extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  render() {
    return (
      <div className={styles.content}>
        <h2>Home</h2>
      </div>
    );
  }
}

export default Relay.createContainer(HomePage, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id,
        }
      }
    `,
  },
});
