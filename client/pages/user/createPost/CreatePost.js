import React from 'react'
import PropTypes from 'prop-types'
import { routerShape } from 'found/lib/PropTypes'
import Relay from 'react-relay/classic'
import Formsy from 'formsy-react'
import { FormsyText } from 'formsy-material-ui'
import RaisedButton from 'material-ui/RaisedButton'

import ImageInput from '../../../common/components/imageInput/ImageInput'
import CreatePostMutation from '../../../mutation/CreatePostMutation'
import { ROLES } from '../../../../config'

import styles from './CreatePost.css'

class CreatePostPage extends React.Component {
  static propTypes = {
    router: routerShape.isRequired,
    viewer: PropTypes.shape({
      user: PropTypes.shape({
        role: PropTypes.string.isRequired,
      }),
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

  createPost = model => {
    const user = this.props.viewer.user

    Relay.Store.commitUpdate(
      new CreatePostMutation({
        title: model.title,
        description: model.description,
        image: model.image.item(0),
        user,
      }),
      {
        onFailure: transaction => {
          console.log('Creating post Failed')
          console.log(transaction.getError())
        },
        onSuccess: () => this.props.router.push('/user/posts'),
      },
    )
  }

  render() {
    const viewerRole = this.props.viewer.user.role
    if (viewerRole !== ROLES.publisher && viewerRole !== ROLES.admin) {
      this.props.router.push('/login')
      return <div />
    }

    return (
      <div className={styles.content}>
        <h2>Register</h2>

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

const container = Relay.createContainer(CreatePostPage, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          role,
          ${CreatePostMutation.getFragment('user')}
        }
      }
    `,
  },
})

export default container
