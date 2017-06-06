import React from 'react'
import PropTypes from 'prop-types'
import { routerShape } from 'found/lib/PropTypes'
import { createFragmentContainer, graphql } from 'react-relay'

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
        <div id="container">
          <Header
            user={this.props.viewer.user}
            toggleNavigation={() => this.toggleNavigation()}
          />

          <Navigation
            user={this.props.viewer.user}
            open={this.state.navigationOpen}
            close={() => this.closeNavigation()}
            navigateTo={route => this.navigateTo(route)}
          />

          {this.props.children}
        </div>
      </div>
    )
  }
}

export default createFragmentContainer(
  App,
  graphql`
    fragment App_viewer on Viewer {
      user {
        ...Header_user
        ...Navigation_user
      }
    }
  `,
)
