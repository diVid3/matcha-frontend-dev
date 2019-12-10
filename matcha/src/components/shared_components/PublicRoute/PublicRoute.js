import React, { Component } from 'react'
import {
  Route,
  Redirect
} from "react-router-dom";

export class PublicRoute extends Component {
  constructor(props) {
    super(props)

    this.state = {
      canView: false,
      isLoggedIn: false,
      redirectTo: ''
    }
  }
  
  componentDidMount() {

    if (
      document.cookie &&
      document.cookie.includes('=') &&
      document.cookie.split('=')[0] === 'sid' &&
      (document.cookie.split('=')[1]).length >= 80 &&
      (document.cookie.split('=')[1]).length <= 100
    ) {

      this.setState({
        isLoggedIn: true,
        redirectTo: '/profile'
      })
    }
    else {

      this.setState({
        canView: true
      })
    }
  }

  render() {
    return (
      <Route path={this.props.path} exact={this.props.exact ? true : undefined}>
        {
          this.state.redirectTo
            ? <Redirect to={`${this.state.redirectTo}`}/>
            : null
        }
        {
          !this.state.isLoggedIn && this.state.canView
            ? React.Children.map(this.props.children, child => React.cloneElement(child, { ...this.props }))
            : null
        }
      </Route>
    )
  }
}

export default PublicRoute
