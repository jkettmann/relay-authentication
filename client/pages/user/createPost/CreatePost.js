import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { browserHistory } from 'react-router';
import Formsy from 'formsy-react';
import { FormsyText } from 'formsy-material-ui';
import RaisedButton from 'material-ui/RaisedButton';

import ImageInput from '../../../common/components/imageInput/ImageInput';
import CreatePostMutation from '../../../mutation/CreatePostMutation';
import { ROLES, Errors } from '../../../../config';

import styles from './CreatePost.css';


export class CreatePostPage extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  constructor () {
    super();
    this.state = {
      canSubmit: false
    };
  }

  enableButton () {
    this.setState({
      canSubmit: true
    });
  }

  disableButton () {
    this.setState({
      canSubmit: false
    });
  }

  openFileDialog () {
    const fileUploadDom = ReactDOM.findDOMNode(this.refs.imageInput);
    const input = fileUploadDom.children[1].children[0];
    input.click();
  }

  createPost (user, model) {
    Relay.Store.commitUpdate(
      new CreatePostMutation({
        title:    model.title,
        description: model.description,
        image: model.image.item(0),
        user: user
      }),
      {
        onFailure: (transaction) => {
          console.log('Creating post Failed');
          console.log(transaction.getError());
          const errorMessage = transaction.getError().source.errors[0].message;
          const formError = {};

          switch (errorMessage) {
            case Errors.EmailAlreadyTaken:
              formError.email = 'This email address is already taken. Please enter a new one.';
              break;
          }

          this.refs.form.updateInputsWithError(formError);
        },
        onSuccess: (response) => {
          this.context.router.push('/user/posts')
        }
      }
    );
  }

  render() {
    const viewerRole = this.props.viewer.user.role;
    if (viewerRole !== ROLES.publisher && viewerRole !== ROLES.admin) {
      this.context.router.push('/login');
      return <div/>;
    }

    return (
      <div className={styles.content}>
        <h2>Register</h2>

        <Formsy.Form
          ref="form"
          onValid={() => this.enableButton()}
          onInvalid={() => this.disableButton()}
          onSubmit={(model) => this.createPost(this.props.viewer.user, model)}
          className={styles.form} >

          <FormsyText
            name="title"
            floatingLabelText="Title"
            fullWidth={true}
            validations="isWords"
            validationError="Please enter a title"
            required />

          <FormsyText
            name="description"
            floatingLabelText="Description"
            fullWidth={true}
            validations="isWords"
            validationError="Please enter a description"
            required />

          <ImageInput
            label="Select Image"
            name="image"
            style={{marginTop: 20}}
            validations="isExisty"
            validationError="Please select an image"
            fullWidth={true} />

          <RaisedButton
            type="submit"
            label="Save post"
            secondary={true}
            fullWidth={true}
            style={{marginTop: 20}}
            disabled={!this.state.canSubmit} />

        </Formsy.Form>

      </div>
    );
  }
}

const container = Relay.createContainer(CreatePostPage, {
  fragments: {
    // we fetch posts, to update user posts via forceFetch after login
    // thus we are able to see if a user has posts, otherwise we would need to refresh the browser
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id,
          role,
          posts (first: 1) {
            edges {
              node {
                title
              }
            }
          }
          ${CreatePostMutation.getFragment('user')}
        }
      }
    `,
  }
});

export default container;
