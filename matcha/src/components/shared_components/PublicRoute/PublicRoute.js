import React, { Component } from 'react'
import {
  Route,
  Redirect
} from "react-router-dom";

export class PublicRoute extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoggedIn: false,
      redirectTo: ''
    }

    this.pendingPromises = []
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
  }

  render() {
    return (
      <Route path={this.props.path} {...this.props}>
        {
          this.state.redirectTo
            ? <Redirect to={`${this.state.redirectTo}`}/>
            : null
        }
        {
          !this.state.isLoggedIn
            ? this.props.children
            : null
        }
      </Route>
    )
  }
}

export default PublicRoute
