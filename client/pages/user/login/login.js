import React from 'react'
import PropTypes from 'prop-types'
import Relay from 'react-relay'
import Formsy from 'formsy-react'
import { FormsyText } from 'formsy-material-ui'
import RaisedButton from 'material-ui/RaisedButton'

import LoginMutation from '../../../mutation/LoginMutation'
import { ROLES, Errors } from '../../../../config'

import styles from './login.css'

class LoginPage extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    viewer: PropTypes.shape({
      user: PropTypes.shape({
        role: PropTypes.string.isRequired,
      }),
    }).isRequired,
    location: PropTypes.shape({
      state: PropTypes.shape({
        previousPath: PropTypes.string.isRequired,
      }),
    }).isRequired,
  }

  setFormElement = element => {
    this.formElement = element
  }

  login = model => {
    const user = this.props.viewer.user

    Relay.Store.commitUpdate(
      new LoginMutation({
        email: model.email,
        password: model.password,
        user,
      }),
      {
        onFailure: transaction => {
          console.log('login failed')
          console.log(transaction.getError().source)
          const errorMessage = transaction.getError().source.errors[0].message
          const formError = {}

          switch (errorMessage) {
            case Errors.WrongEmailOrPassword:
              formError.email = 'Email or password is incorrect'
              formError.password = 'Email or password is incorrect'
              break

            default:
              break
          }

          this.formElement.updateInputsWithError(formError)
        },
        onSuccess: () =>
          this.props.location.state
            ? this.context.router.push(
                {},
                this.props.location.state.previousPath,
              )
            : this.context.router.goBack(),
      },
    )
  }

  render() {
    const viewerRole = this.props.viewer.user.role
    if (viewerRole !== ROLES.anonymous) {
      this.context.router.push('/')
      return <div />
    }

    const submitMargin = { marginTop: 20 }

    return (
      <div className={styles.content}>
        <h2>Login</h2>

        <Formsy.Form
          ref={this.setFormElement}
          onSubmit={this.login}
          className={styles.form}
        >

          <FormsyText
            name="email"
            floatingLabelText="E-Mail"
            fullWidth
            validations="isEmail"
            validationError="Please enter a valid email address"
          />

          <FormsyText
            name="password"
            type="password"
            floatingLabelText="Passwort"
            fullWidth
          />

          <RaisedButton
            type="submit"
            label="Login"
            secondary
            fullWidth
            style={submitMargin}
          />

          <RaisedButton
            label="Register"
            primary
            fullWidth
            style={submitMargin}
            onClick={() => this.context.router.push('/register')}
          />

        </Formsy.Form>

      </div>
    )
  }
}

export default Relay.createContainer(LoginPage, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id,
          role,
          ${LoginMutation.getFragment('user')}
        }
      }
    `,
  },
})
