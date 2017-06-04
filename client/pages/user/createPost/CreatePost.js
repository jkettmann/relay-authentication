import React from 'react'
import PropTypes from 'prop-types'
import Relay from 'react-relay/classic'
import Formsy from 'formsy-react'
import { FormsyText } from 'formsy-material-ui'
import RaisedButton from 'material-ui/RaisedButton'

import ImageInput from '../../../common/components/imageInput/ImageInput'
import CreatePostMutation from '../../../mutation/CreatePostMutation'
import { ROLES, Errors } from '../../../../config'

import styles from './CreatePost.css'

class CreatePostPage extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
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

  setFormElement = element => {
    this.formElement = element
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
          const errorMessage = transaction.getError().source.errors[0].message
          const formError = {}

          switch (errorMessage) {
            case Errors.EmailAlreadyTaken:
              formError.email =
                'This email address is already taken. Please enter a new one.'
              break

            default:
              break
          }

          this.formElement.updateInputsWithError(formError)
        },
        onSuccess: () => this.context.router.push('/user/posts'),
      },
    )
  }

  render() {
    const viewerRole = this.props.viewer.user.role
    if (viewerRole !== ROLES.publisher && viewerRole !== ROLES.admin) {
      this.context.router.push('/login')
      return <div />
    }

    return (
      <div className={styles.content}>
        <h2>Register</h2>

        <Formsy.Form
          ref={this.setFormElement}
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
  },
})

export default container
