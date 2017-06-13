import React from 'react'
import PropTypes from 'prop-types'
import { routerShape } from 'found/lib/PropTypes'
import { createFragmentContainer, graphql } from 'react-relay'

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import Header from './header/Header'
import Navigation from './navigation/Navigation'
import Loading from './Loading'

class App extends React.Component {
  static childContextTypes = {
    muiTheme: PropTypes.object.isRequired,
  }

  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    viewer: PropTypes.shape({
      user: PropTypes.object,
    }),
    children: PropTypes.node.isRequired,
    router: routerShape.isRequired,
    isLoading: PropTypes.bool,
  }

  static defaultProps = {
    viewer: {},
    isLoading: false,
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

  toggleNavigation = () => {
    const state = this.state
    state.navigationOpen = !this.state.navigationOpen
    this.setState(state)
  }

  closeNavigation = () => {
    const state = this.state
    state.navigationOpen = false
    this.setState(state)
  }

  navigateTo = (route) => {
    this.props.router.push(route)
    this.closeNavigation()
  }

  render() {
    const { viewer, children, isLoading } = this.props

    return (
      <div>
        <div id="container">
          <Header
            viewer={viewer}
            toggleNavigation={this.toggleNavigation}
          />

          <Navigation
            viewer={viewer}
            open={this.state.navigationOpen}
            close={this.closeNavigation}
            navigateTo={this.navigateTo}
          />

          {children}
        </div>

        {isLoading && <Loading />}
      </div>
    )
  }
}

export default createFragmentContainer(
  App,
  graphql`
    fragment App_viewer on Viewer {
      ...Header_viewer
      ...Navigation_viewer
    }
  `,
)
