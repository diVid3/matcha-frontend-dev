import React, { Component } from 'react'
import SessionProvider from '../../../providers/SessionProvider'
import PromiseCancel from '../../../helpers/PromiseCancel'
import {
  Route,
  Redirect
} from "react-router-dom";

export class ProtectedRoute extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoggedIn: true,
      redirectTo: ''
    }

    this.pendingPromises = []
  }
  
  componentDidMount() {

    // Checking if sid is valid
    if (
      document.cookie &&
      document.cookie.includes('=') &&
      document.cookie.split('=')[0] === 'sid' &&
      (document.cookie.split('=')[1]).length >= 80 &&
      (document.cookie.split('=')[1]).length <= 100
    ) {

      const cancelableIsLoggedInPromise = PromiseCancel.makeCancelable(
        SessionProvider.isLoggedIn()
      )
  
      this.pendingPromises.push(cancelableIsLoggedInPromise)
  
      cancelableIsLoggedInPromise.promise
      .then((data) => {
  
        if (!data.isLoggedIn) {
  
          this.setState({
            isLoggedIn: false,
            redirectTo: '/'
          })
        }
      })
      .catch((json) => {
  
        sessionStorage.setItem('viewError', '1')
        
        this.setState({
          isBusy: false,
          redirectTo: '/oops'
        })
      })
    }
    else {

      this.setState({
        isLoggedIn: false,
        redirectTo: '/'
      })
    }
  }

  render() {
    return (
      <Route path={this.props.path}>
        {
          this.state.redirectTo
            ? <Redirect to={`${this.state.redirectTo}`}/>
            : null
        }
        {
          this.state.isLoggedIn
            ? this.props.children
            : null
        }
      </Route>
    )
  }
}

export default ProtectedRoute
