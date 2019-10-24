import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import ResetProvider from '../../../../providers/ResetProvider'
import PromiseCancel from '../../../../helpers/PromiseCancel'
import LoadingSpinner from '../../../shared_components/LoadingSpinner/LoadingSpinner'

import './VerifyReset.css'

export class VerifyReset extends Component {
  constructor(props) {
    super(props)

    this.state = {
      verified: false,
      redirectTo: '',
      password: '',
      confirmPassword: '',
    }

    this.pendingPromises = []
  }

  componentDidMount() {
    
    const cancelableVerifyResetPromise = PromiseCancel.makeCancelable(
      ResetProvider.verifyReset({ resetToken: this.props.uuid })
    )

    this.pendingPromises.push(cancelableVerifyResetPromise)

    cancelableVerifyResetPromise.promise
    .then((json) => {

      this.setState({
        verified: true
      })
    })
    .catch((json) => {

      sessionStorage.setItem('viewError', '1')
      
      this.setState({
        redirectTo: '/oops'
      })
    })
  }

  componentWillUnmount() {

    this.pendingPromises.map(p => p.cancel())
  }

  // TODO: Finish this, this will need to display the loading spinner whilst verifying the resetToken, if verified
  // display the reset form.

  render() {
    return (
      <div className="verify-reset-body">
        {
          this.state.redirectTo
            ? <Redirect to={`${this.state.redirectTo}`}/>
            : null
        }
        {
          this.state.verified
            ? <div className="verify-reset-body-form-body">
                <form className="login-form" onSubmit={this.handleSubmit}>
                  <h2>Reset</h2>
                  <input
                    className={
                      `login-form-input ${
                        this.state.emailValid
                          ? ''
                          : 'input-bad'
                      }`
                    }
                    type="password"
                    name="email"
                    value={this.state.password}
                    placeholder="Password"
                    onChange={
                      this.handleChangeDecorator(
                        'emailValid',
                        InputValidation.isValidEmail
                      )
                    }
                  />
                  <input
                    className={
                      `login-form-input ${
                        this.state.passwordValid
                          ? ''
                          : 'input-bad'
                      }`
                    }
                    type="password"
                    name="password"
                    value={this.state.password}
                    placeholder="Password"
                    onChange={
                      this.handleChangeDecorator(
                        'passwordValid',
                        InputValidation.isValidPassword
                      )
                    }
                  />
                  <p className="reset-text">
                    <a
                      className="reset-form"
                      href="/#"
                      onClick={this.switchFormDecorator('resetSendEmail')}
                    >
                      Forgot password?
                    </a>
                  </p>
                  {
                    this.state.showError
                      ? <div className="correct-errors-message">
                          <p>{this.state.errorToShow}</p>
                        </div>
                      : ''
                  }
                  <button
                    className="login-form-button"
                    type="submit"
                    value="Submit"
                  >
                    Login
                  </button>
                  <p className="switch-to-register-text">
                    Not a member? <a
                      className="switch-to-register"
                      href="/#"
                      onClick={this.switchFormDecorator('register')}
                    >
                      Register here
                    </a>
                  </p>
                </form>
              </div>
            :
        }
      </div>
    )
  }
}

export default VerifyReset
