import React from 'react';
import Relay from 'react-relay';

import Header from './header/Header';
import Navigation from './navigation/Navigation';

class App extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  constructor () {
    super();
    this.state = {
      navigationOpen: false
    };
  }

  toggleNavigation () {
    const state = this.state;
    state.navigationOpen = !this.state.navigationOpen;
    this.setState(state);
  }

  closeNavigation () {
    const state = this.state;
    state.navigationOpen = false;
    this.setState(state);
  }

  navigateTo (route) {
    this.context.router.push(route);
    this.closeNavigation();
  }

  render () {
    return (
      <div>
        <Header
          viewer={this.props.viewer}
          toggleNavigation={() => this.toggleNavigation()} />

        <Navigation
          viewer={this.props.viewer}
          open={this.state.navigationOpen}
          close={() => this.closeNavigation()}
          navigateTo={(route) => this.navigateTo(route)} />

        <div id="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${Header.getFragment('viewer')},
        ${Navigation.getFragment('viewer')}
      }
    `
  }
});
