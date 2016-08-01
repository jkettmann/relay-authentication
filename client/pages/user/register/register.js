import React from 'react';
import Relay from 'react-relay';
import { browserHistory } from 'react-router';
import Formsy from 'formsy-react';
import { FormsyText } from 'formsy-material-ui';
import RaisedButton from 'material-ui/RaisedButton';

import RegisterMutation from '../../../mutation/RegisterMutation';
import { ROLES, Errors } from '../../../../config';

import styles from './register.css';


export class RegisterPage extends React.Component {

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

  register (model) {
    Relay.Store.commitUpdate(
      new RegisterMutation({
        email:    model.email,
        password: model.password,
        firstName: model.firstName,
        lastName: model.lastName,
        role: model.role,
        user: null
      }),
      {
        onFailure: (transaction) => {
          console.log('Registration Failed');
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
          this.context.router.push('/login')
        }
      }
    );
  }

  render() {
    const viewerRole = this.props.viewer.user.role;
    if (viewerRole !== ROLES.anonymous) {
      this.context.router.push('/');
      return <div/>;
    }

    return (
      <div className={styles.content}>
        <h2>Register</h2>

        <Formsy.Form
          ref="form"
          onValid={() => this.enableButton()}
          onInvalid={() => this.disableButton()}
          onSubmit={(model) => this.register(model)}
          className={styles.form} >

          <FormsyText
            name="email"
            floatingLabelText="E-Mail"
            fullWidth={true}
            validations="isEmail"
            validationError="Please enter a valid email address"
            required />

          <FormsyText
            name="password"
            type="password"
            floatingLabelText="Passwort"
            fullWidth={true}
            validations="minLength:5"
            validationError="Please enter at least 5 characters"
            required />

          <FormsyText
            name="firstName"
            floatingLabelText="First Name"
            fullWidth={true}
            validations="isWords"
            validationError="Please enter your first name"
            required />

          <FormsyText
            name="lastName"
            floatingLabelText="Last Name"
            fullWidth={true}
            validations="isWords"
            validationError="Please enter your last name"
            required />

          <FormsyText
            name="role"
            value={ROLES.reader}
            style={{display: 'none'}} />

          <RaisedButton
            type="submit"
            label="Register"
            secondary={true}
            fullWidth={true}
            style={{marginTop: 20}}
            disabled={!this.state.canSubmit} />

          <RaisedButton
            label="Login"
            primary={true}
            fullWidth={true}
            style={{marginTop: 20}}
            onClick={() => this.context.router.push('/login')} />

        </Formsy.Form>



      </div>
    );
  }
}

const container = Relay.createContainer(RegisterPage, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id,
          role,
          ${RegisterMutation.getFragment('user')}
        }
      }
    `,
  }
});

export default container;
