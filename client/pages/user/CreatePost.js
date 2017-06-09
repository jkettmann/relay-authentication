import React from 'react'
import PropTypes from 'prop-types'
import { routerShape } from 'found/lib/PropTypes'
import { createFragmentContainer, graphql } from 'react-relay'
import Formsy from 'formsy-react'
import { FormsyText } from 'formsy-material-ui'
import RaisedButton from 'material-ui/RaisedButton'

import ImageInput from '../../components/imageInput/ImageInput'
import CreatePostMutation from '../../mutation/CreatePostMutation'

import styles from './CreatePost.css'

class CreatePostPage extends React.Component {
  static propTypes = {
    router: routerShape.isRequired,
    relay: PropTypes.shape({
      environment: PropTypes.any.isRequired,
    }).isRequired,
    viewer: PropTypes.shape({
      canPublish: PropTypes.bool,
    }).isRequired,
  }

  constructor() {
    super()
    this.state = {
      canSubmit: false,
    }
  }

  enableButton = () => {
    this.setState({
      canSubmit: true,
    })
  }

  disableButton = () => {
    this.setState({
      canSubmit: false,
    })
  }

  createPost = ({ title, description, image }) => {
    const environment = this.props.relay.environment

    CreatePostMutation.commit({
      environment,
      input: { title, description },
      files: image,
      onCompleted: () => this.props.router.push('/user/posts'),
      onError: errors => console.error('Creating post Failed', errors[0]),
    })
  }

  render() {
    const viewer = this.props.viewer
    if (!viewer.canPublish) {
      this.props.router.push('/login')
      return <div />
    }

    return (
      <div className={styles.content}>
        <h2>Create Post</h2>

        <Formsy.Form
          onValid={this.enableButton}
          onInvalid={this.disableButton}
          onSubmit={this.createPost}
          className={styles.form}
        >

          <FormsyText
            name="title"
            floatingLabelText="Title"
            fullWidth
            validations="isWords"
            validationError="Please enter a title"
            required
          />

          <FormsyText
            name="description"
            floatingLabelText="Description"
            fullWidth
            validations="isWords"
            validationError="Please enter a description"
            required
          />

          <ImageInput
            label="Select Image"
            name="image"
            style={{ marginTop: 20 }}
            validations="isExisty"
            validationError="Please select an image"
            fullWidth
          />

          <RaisedButton
            type="submit"
            label="Save post"
            secondary
            fullWidth
            style={{ marginTop: 20 }}
            disabled={!this.state.canSubmit}
          />

        </Formsy.Form>

      </div>
    )
  }
}

const container = createFragmentContainer(
  CreatePostPage,
  graphql`
    fragment CreatePost_viewer on Viewer {
      canPublish
    }
  `,
)

export default container
