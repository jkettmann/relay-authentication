import React from 'react'
import PropTypes from 'prop-types'
import { routerShape } from 'found/lib/PropTypes'
import { createFragmentContainer, graphql } from 'react-relay'
import Formsy from 'formsy-react'
import { FormsyText } from 'formsy-material-ui'
import RaisedButton from 'material-ui/RaisedButton'

import LoginMutation from '../../../mutation/LoginMutation'
import { ERRORS } from '../../../../config'

import styles from './Login.css'

class LoginPage extends React.Component {
  static propTypes = {
    router: routerShape.isRequired,
    relay: PropTypes.shape({
      environment: PropTypes.any.isRequired,
    }).isRequired,
    viewer: PropTypes.shape({
      isLoggedIn: PropTypes.bool,
    }).isRequired,
  }

  setFormElement = element => {
    this.formElement = element
  }

  login = ({ email, password }) => {
    const environment = this.props.relay.environment
    LoginMutation.commit({
      environment,
      input: { email, password },
      onCompleted: response => {
        console.log('login success', response)
        this.props.router.go(-1)
      },
      onError: error => {
        console.log('login failed')
        console.log(error)
        const formError = {}
        switch (error) {
          case ERRORS.WrongEmailOrPassword:
            formError.email = 'Email or password is incorrect'
            formError.password = 'Email or password is incorrect'
            break
          default:
            break
        }
        this.formElement.updateInputsWithError(formError)
      },
    })
  }

  render() {
    const viewer = this.props.viewer
    if (viewer.isLoggedIn) {
      this.props.router.push('/')
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
            onClick={() => this.props.router.push('/register')}
          />

        </Formsy.Form>

      </div>
    )
  }
}

export default createFragmentContainer(
  LoginPage,
  graphql`
    fragment Login_viewer on Viewer {
      isLoggedIn
    }
  `,
)
