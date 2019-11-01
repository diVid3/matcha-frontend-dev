import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import ResetProvider from '../../../../providers/ResetProvider'
import PromiseCancel from '../../../../helpers/PromiseCancel'
import InputValidation from '../../../../helpers/InputValidation'

import './VerifyReset.css'
import LoadingSpinner from '../../../shared_components/LoadingSpinner/LoadingSpinner'

export class VerifyReset extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      redirectTo: '',
      password: '',
      passwordValid: true,
      passwordConfirm: '',
      passwordConfirmValid: true,
      passwordsMatch: true,
      errorToShow: ''
    }

    this.pendingPromises = []
    
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this)
    this.showCorrectErrors = this.showCorrectErrors.bind(this)
    this.handleSubmitErrors = this.handleSubmitErrors.bind(this)
    this.handleInitialSubmit = this.handleInitialSubmit.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    
    const cancelableVerifyResetPromise = PromiseCancel.makeCancelable(
      ResetProvider.verifyReset({ resetToken: this.props.uuid })
    )

    this.pendingPromises.push(cancelableVerifyResetPromise)

    cancelableVerifyResetPromise.promise
    .then((json) => {

      if (!json.rows.length) {

        throw new Error('empty rows')
      }

      if (!json.rows.length > 1) {

        throw new Error('same resetToken for multiple users.')
      }

      return json
    })
    .then((json) => {

      this.setState({
        email: json.rows[0].email
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

  handlePasswordChange(e) {
    const { name, value } = e.target

    this.setState({
      [name]: value,
      passwordValid: InputValidation.isValidPassword(value),
      passwordsMatch: this.state.passwordConfirm === value
    })
  }

  handlePasswordConfirmChange(e) {
    const { name, value } = e.target

    this.setState({
      [name]: value,
      passwordConfirmValid: InputValidation.isValidPassword(value),
      passwordsMatch: this.state.password === value
    })
  }

  showCorrectErrors() {

    const cancelableResetPromise = PromiseCancel.makeCancelable(
      new Promise(res => setTimeout(() => res(true), 3000))
    )

    this.pendingPromises.push(cancelableResetPromise)

    cancelableResetPromise.promise
    .then(() => {

      this.setState({
        errorToShow: ''
      })
    })
    .catch(() => {})
  }

  handleSubmitErrors() {
    
    if (!this.state.password) {
      
      this.setState({ errorToShow: 'Password field contains invalid characters or is empty' })
      this.showCorrectErrors()
      return
    }

    if (!this.state.passwordConfirm) {
      
      this.setState({ errorToShow: 'Confirm password field contains invalid characters or is empty' })
      this.showCorrectErrors()
      return
    }

    if (!this.state.passwordsMatch) {

      this.setState({ errorToShow: 'Passwords do not match' })
      this.showCorrectErrors()
      return
    }

    return true
  }

  handleInitialSubmit() {

    if (this.state.passwordValid && this.state.password === '') {
      
      this.setState({
        passwordValid: false
      })

      return true
    }

    if (this.state.passwordConfirmValid && this.state.passwordConfirm === '') {
      
      this.setState({
        passwordConfirmValid: false
      })

      return true
    }
  }

  handleSubmit(e) {
    e.preventDefault()

    if (this.state.errorToShow.length) {
      
      return
    }

    if (!this.handleSubmitErrors()) {

      return
    }

    if (this.handleInitialSubmit()) {

      return
    }

    if (
      this.state.password &&
      this.state.passwordConfirm &&
      this.state.passwordsMatch
    ) {

      console.log('Password reset form submitted!')

      // TODO: Call provider here.
    }
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
          !this.state.email.length
            ? <div className="verify-reset-body-loading">
                <h2>Verifying...</h2>
                <div className="verify-reset-body-spinner-container">
                  <LoadingSpinner />
                </div>
              </div>
            : null
        }
        {
          this.state.email.length
            ? <form className="verify-reset-password-form" onSubmit={this.handleSubmit}>
                <h2>Reset Pass</h2>
                <p className="verify-reset-password-form-message">
                  Remember, do not share your password with anyone
                </p>
                <input
                  className={
                    `verify-reset-password-form-input ${
                      this.state.passwordValid
                        ? ''
                        : 'input-bad'
                    }`
                  }
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  placeholder="Password"
                />
                <input
                  className={
                    `verify-reset-password-form-input ${
                      (this.state.passwordConfirmValid &&
                      this.state.passwordsMatch)
                        ? ''
                        : 'input-bad'
                    }`
                  }
                  name="passwordConfirm"
                  type="password"
                  value={this.state.passwordConfirm}
                  onChange={this.handlePasswordConfirmChange}
                  placeholder="Confirm Password"
                />
                {
                  this.state.errorToShow.length
                    ? <div className="verify-reset-password-form-correct-errors-message">
                        <p>{this.state.errorToShow}</p>
                      </div>
                    : null
                }
                <button
                  className="verify-reset-password-form-button"
                  type="submit"
                  value="Submit"
                >
                  Reset
                </button>
              </form>
            : null
        }
      </div>
    )
  }
}

export default VerifyReset
