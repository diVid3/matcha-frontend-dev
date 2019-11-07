import React, { Component } from 'react'
import InputValidation from '../../../../helpers/InputValidation'
import PromiseCancel from '../../../../helpers/PromiseCancel'
import SessionProvider from '../../../../providers/SessionProvider'

import './LoginForm.css'

export class LoginForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      emailValid: true,
      passwordValid: true,
      showError: false,
      errorToShow: ''
    }

    this.pendingPromises = []

    this.handleChangeDecorator = this.handleChangeDecorator.bind(this)
    this.switchFormDecorator = this.switchFormDecorator.bind(this)
    this.handleSubmitErrors = this.handleSubmitErrors.bind(this)
    this.handleInitialSubmit = this.handleInitialSubmit.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeDecorator(targetState, validationFunc) {

    return (e) => {
      const { name, value } = e.target

      if (targetState && validationFunc) {
        this.setState({
          [name]: value,
          [targetState]: validationFunc(value)
        })
      }

      this.setState({
        [name]: value
      })
    }
  }

  switchFormDecorator(formToSwitchTo) {
    
    return (e) => {
      e.preventDefault()

      this.props.switchForm(formToSwitchTo)
    }
  }

  componentWillUnmount() {

    this.pendingPromises.map(p => p.cancel())
  }

  showCorrectErrors() {

    this.setState({
      showError: !this.state.showError
    })

    const cancelableResetPromise = PromiseCancel.makeCancelable(
      new Promise(res => setTimeout(() => res(true), 3000))
    )

    this.pendingPromises.push(cancelableResetPromise)

    cancelableResetPromise.promise
      .then(() => {

        this.setState({
          showError: !this.state.showError,
          errorToShow: ''
        })
      })
      .catch(() => {})
  }

  handleSubmitErrors() {

    if (!this.state.emailValid) {
      
      this.setState({ errorToShow: 'Email field contains invalid characters or is empty' })
      this.showCorrectErrors()
      return
    }

    if (!this.state.passwordValid) {
      
      this.setState({ errorToShow: 'Password field contains invalid characters or is empty' })
      this.showCorrectErrors()
      return
    }

    return true
  }

  handleInitialSubmit() {

    let errorsFound = false;

    if (this.state.emailValid && this.state.email === '') {
      
      this.setState({
        emailValid: false
      })

      errorsFound = true
    }

    if (this.state.passwordValid && this.state.password === '') {

      this.setState({
        passwordValid: false
      })

      errorsFound = true
    }

    if (errorsFound) {

      return true
    }
  }

  handleSubmit(e) {
    e.preventDefault()

    if (this.state.showError) {

      return
    }

    if (!this.handleSubmitErrors()) {

      return
    }

    if (this.handleInitialSubmit()) {

      return
    }

    if (this.state.emailValid && this.state.passwordValid) {

      // TODO: After successful login, either call a prop to switch to /profile, or do a setState with the redirect
      // component.
      SessionProvider.login({
        email: this.state.email,
        password: this.state.password
      })
      .then((json) => {
        console.log(json)
      })
      .catch((json) => {
        console.log(json)
      })
    }
  }

  render() {
    return (
      <div className="landing-form-login-body">
        <form className="login-form" onSubmit={this.handleSubmit}>
          <h2>Login</h2>
          <input
            className={
              `login-form-input ${
                this.state.emailValid
                  ? ''
                  : 'input-bad'
              }`
            }
            type="text"
            name="email"
            value={this.state.email}
            placeholder="Email"
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
    )
  }
}

export default LoginForm
