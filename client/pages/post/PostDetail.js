import React from 'react';
import Relay from 'react-relay';

const PostDetail = (props) => {
  return (
    <div>
      {props.viewer.post.title}<br/>
      {props.viewer.post.description}
    </div>
  );
};

export default Relay.createContainer(PostDetail, {
  initialVariables: {
    postId: "invalid"
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        post (postId: $postId) {
          title,
          description
        }
      }
    `
  }
})