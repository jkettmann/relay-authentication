import React from 'react'
import PropTypes from 'prop-types'
import { routerShape } from 'found/lib/PropTypes'
import Relay from 'react-relay/classic'

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Header from './header/Header'
import Navigation from './navigation/Navigation'

class App extends React.Component {
  static childContextTypes = {
    muiTheme: PropTypes.object.isRequired,
  }

  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    viewer: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    router: routerShape.isRequired,
  }

  constructor() {
    super()
    this.state = {
      navigationOpen: false,
    }
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) }
  }

  toggleNavigation() {
    const state = this.state
    state.navigationOpen = !this.state.navigationOpen
    this.setState(state)
  }

  closeNavigation() {
    const state = this.state
    state.navigationOpen = false
    this.setState(state)
  }

  navigateTo(route) {
    this.props.router.push(route)
    this.closeNavigation()
  }

  render() {
    return (
      <div>
        <Header
          viewer={this.props.viewer}
          toggleNavigation={() => this.toggleNavigation()}
        />

        <Navigation
          viewer={this.props.viewer}
          open={this.state.navigationOpen}
          close={() => this.closeNavigation()}
          navigateTo={route => this.navigateTo(route)}
        />

        <div id="container">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${Header.getFragment('viewer')},
        ${Navigation.getFragment('viewer')}
      }
    `,
  },
})
