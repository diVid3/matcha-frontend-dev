import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import './VerifyRegistration.css'
import verified from '../../../../assets/verified2.png'

import PromiseCancel from '../../../../helpers/PromiseCancel'
import RegistrationProvider from '../../../../providers/RegistrationProvider'
import LoadingSpinner from '../../../shared_components/LoadingSpinner/LoadingSpinner'

export class VerifyRegistration extends Component {
  constructor(props) {
    super(props)

    this.state = {
      verified: false,
      redirectTo: ''
    }

    this.pendingPromises = []

    this.switchFormDecorator = this.switchFormDecorator.bind(this)
  }

  componentDidMount() {
    
    const cancelableVerifyRegistrationPromise = PromiseCancel.makeCancelable(
      RegistrationProvider.verifyRegistration({ uuid: this.props.uuid })
    )

    this.pendingPromises.push(cancelableVerifyRegistrationPromise)

    cancelableVerifyRegistrationPromise.promise
    .then(() => {

      this.setState({
        verified: true
      })
    })
    .catch(() => {
      
      this.setState({
        redirectTo: '/oops'
      })
    })
  }

  componentWillUnmount() {

    this.pendingPromises.map(p => p.cancel())
  }

  switchFormDecorator(formToSwitchTo) {
    
    return (e) => {
      e.preventDefault()

      this.props.switchForm(formToSwitchTo)
    }
  }

  render() {
    return (
      <div className="verify-registration-body">
        {
          this.state.redirectTo
            ? <Redirect to={`${this.state.redirectTo}`}/>
            : null
        }
        {
          this.state.verified
            ? <div className="verify-registration-success-body">
                <p className="verify-registration-success-message">
                  You're verified! You can now login! <a
                    className="verified-registration-switch-to-login"
                    href="/#"
                    onClick={this.switchFormDecorator('login')}
                  >
                    Log in here
                  </a>
                </p>
                <img src={verified} alt="registration-verified"/>
              </div>
            : <div className="verify-registration-busy-body">
                <h2>Verifying...</h2>
                <div className="verify-registration-busy-spinner-container">
                  <LoadingSpinner />
                </div>
              </div>
        }
      </div>
    )
  }
}

export default VerifyRegistration
