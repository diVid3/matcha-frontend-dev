import React, { Component } from 'react'
import InputValidation from '../../../../helpers/InputValidation'
import PromiseCancel from '../../../../helpers/PromiseCancel'
import RegistrationProvider from '../../../../providers/RegistrationProvider'

import './RegisterForm.css'

export class RegisterForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      age: '',
      email: '',
      password: '',
      passwordConfirm: '',
      gender: '0',
      firstNameValid: true,
      lastNameValid: true,
      usernameValid: true,
      ageValid: true,
      emailValid: true,
      passwordValid: true,
      passwordConfirmValid: true,
      passwordsMatch: true,
      showCorrectErrorsMessage: false,
      errorToShow: '',
      errorBeingShown: false
    }

    this.pendingPromises = []

    this.handleChangeDecorator = this.handleChangeDecorator.bind(this)
    this.switchFormDecorator = this.switchFormDecorator.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this)
    this.showCorrectErrors = this.showCorrectErrors.bind(this)
    this.handleSubmitErrors = this.handleSubmitErrors.bind(this)
    this.handleInitialSubmit = this.handleInitialSubmit.bind(this)
    this.handelSubmit = this.handelSubmit.bind(this)
  }

  switchFormDecorator(formToSwitchTo) {
    
    return (e) => {
      e.preventDefault()

      this.props.switchForm(formToSwitchTo)
    }
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
    this.setState({
      showCorrectErrorsMessage: !this.state.showCorrectErrorsMessage,
      errorBeingShown: true
    })

    const cancelableResetPromise = PromiseCancel.makeCancelable(
      new Promise(res => setTimeout(() => res(true), 3000))
    )

    this.pendingPromises.push(cancelableResetPromise)

    cancelableResetPromise.promise
      .then(() => {

        this.setState({
          showCorrectErrorsMessage: !this.state.showCorrectErrorsMessage,
          errorToShow: '',
          errorBeingShown: false
        })
      })
      .catch(() => {})
  }

  componentWillUnmount() {

    this.pendingPromises.map(p => p.cancel())
  }

  handleSubmitErrors() {

    if (!this.state.firstNameValid) {

      this.setState({ errorToShow: 'First name field contains invalid characters or is empty' })
      this.showCorrectErrors()
      return
    }

    if (!this.state.lastNameValid) {

      this.setState({ errorToShow: 'Last name field contains invalid characters or is empty' })
      this.showCorrectErrors()
      return
    }

    if (!this.state.usernameValid) {

      this.setState({ errorToShow: 'Username field contains invalid characters or is empty' })
      this.showCorrectErrors()
      return
    }

    if (!this.state.ageValid) {

      if (!InputValidation.isValidAgeChars(this.state.age)) {
  
        this.setState({ errorToShow: 'Age name field contains invalid characters or is empty' })
        this.showCorrectErrors()
        return
      }
  
      if (!InputValidation.isValidAgeRange(this.state.age)) {
        this.setState({ errorToShow: 'Age must be between 18 and 99' })
        this.showCorrectErrors()
        return
      }
    }

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

    if (!this.state.passwordConfirmValid) {

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

    let errorsFound = false;

    if (this.state.firstNameValid && this.state.firstName === '') {
      
      this.setState({
        firstNameValid: false
      })

      errorsFound = true
    }

    if (this.state.lastNameValid && this.state.lastName === '') {
      
      this.setState({
        lastNameValid: false
      })

      errorsFound = true
    }

    if (this.state.usernameValid && this.state.username === '') {
      
      this.setState({
        usernameValid: false
      })

      errorsFound = true
    }

    if (this.state.ageValid && this.state.age === '') {
      
      this.setState({
        ageValid: false
      })

      errorsFound = true
    }

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

    if (this.state.passwordConfirmValid && this.state.passwordConfirm === '') {

      this.setState({
        passwordConfirmValid: false
      })

      errorsFound = true
    }

    if (errorsFound) {

      return true
    }
  }
  
  handelSubmit(e) {
    e.preventDefault()

    if (this.state.errorBeingShown) {

      return
    }

    if (!this.handleSubmitErrors()) {
      
      return
    }

    if (this.handleInitialSubmit()) {

      return
    }

    if (
      this.state.firstNameValid &&
      this.state.lastNameValid &&
      this.state.usernameValid &&
      this.state.ageValid &&
      this.state.emailValid &&
      this.state.passwordValid &&
      this.state.passwordConfirmValid &&
      this.state.passwordsMatch
    ) {

      // console.log(this.state.firstName)
      // console.log(this.state.lastName)
      // console.log(this.state.username)
      // console.log(this.state.age)
      // console.log(this.state.email)
      // console.log(this.state.password)
      // console.log(this.state.passwordConfirm)

      RegistrationProvider.registerUser({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        username: this.state.username,
        age: this.state.age,
        email: this.state.email,
        password: this.state.password,
        passwordConfirm: this.state.passwordConfirm,
        gender: this.state.gender
      })
      // .then((response) => {
      //   console.log(response)
      //   response.json()
      // })
      .then((data) => {
        console.log('RegisterForm Component data received:')
        console.log(data)
        // TODO: Check if data contains success: true
      })
      .catch((err) => {

        // Would preferably contact sentry.io here.
      })
    }
  }

  render() {
    return (
      <div className="landing-form-register-body">
        <form className="register-form" onSubmit={this.handelSubmit}>
          <h2>Register</h2>
          <div className="register-split-block">
            <input
              className={
                `register-split-item ${
                  this.state.firstNameValid
                    ? ''
                    : 'input-bad'
                }`
              }
              name="firstName"
              value={this.state.firstName}
              type="text"
              onChange={
                this.handleChangeDecorator(
                  'firstNameValid',
                  InputValidation.isValidName
                )
              }
              placeholder="First Name"
            />
            <input
              className={
                `register-split-item ${
                  this.state.lastNameValid
                    ? ''
                    : 'input-bad'
                }`
              }
              name="lastName"
              value={this.state.lastName}
              type="text"
              onChange={
                this.handleChangeDecorator(
                  'lastNameValid',
                  InputValidation.isValidName
                )
              }
              placeholder="Last Name"
            />
          </div>
          <input
            className={
              `register-form-block ${
                this.state.usernameValid
                  ? ''
                  : 'input-bad'
              }`
            }
            name="username"
            value={this.state.username}
            type="text"
            onChange={
              this.handleChangeDecorator(
                'usernameValid',
                InputValidation.isValidName
              )
            }
            placeholder="Username"
          />
          <input
            className={
              `register-form-block ${
                this.state.ageValid
                  ? ''
                  : 'input-bad'
              }`
            }
            name="age"
            value={this.state.age}
            type="text"
            onChange={
              this.handleChangeDecorator(
                'ageValid',
                InputValidation.isValidAge
              )
            }
            placeholder="Age"
          />
          <input
            className={
              `register-form-block ${
                this.state.emailValid
                  ? ''
                  : 'input-bad'
              }`
            }
            name="email"
            value={this.state.email}
            type="text"
            onChange={
              this.handleChangeDecorator(
                'emailValid',
                InputValidation.isValidEmail
              )
            }
            placeholder="Email"
          />
          <div className="register-split-block">
            <input
              className={
                `register-split-item ${
                  this.state.passwordValid
                    ? ''
                    : 'input-bad'
                }`
              }
              name="password"
              value={this.state.password}
              type="password"
              onChange={this.handlePasswordChange}
              placeholder="Password"
            />
            <input
              className={
                `register-split-item ${
                  (this.state.passwordConfirmValid &&
                  this.state.passwordsMatch)
                    ? ''
                    : 'input-bad'
                }`
              }
              name="passwordConfirm"
              value={this.state.passwordConfirm}
              type="password"
              onChange={this.handlePasswordConfirmChange}
              placeholder="Confirm Password"
            />
          </div>
          <div className="register-form-block register-form-radio-buttons">
            <div className="register-form-radio-group">
              <input
                id="register-male"
                name="gender"
                value="0"
                type="radio"
                onChange={this.handleChangeDecorator()}
                defaultChecked
              />
              <label htmlFor="register-male">Male</label>
            </div>
            <div className="register-form-radio-group">
              <input
                id="register-female"
                name="gender"
                value="1"
                type="radio"
                onChange={this.handleChangeDecorator()}
              />
              <label htmlFor="register-female">Female</label>
            </div>
            <div className="register-form-radio-group">
              <input
                id="register-other"
                name="gender"
                value="2"
                type="radio"
                onChange={this.handleChangeDecorator()}
              />
              <label htmlFor="register-other">Other</label>
            </div>
          </div>
          {
            this.state.showCorrectErrorsMessage
              ? <div className="correct-errors-message">
                  <p>{this.state.errorToShow}</p>
                </div>
              : ''
          }
          <button
            className="register-form-button"
            type="submit"
            value="Submit"
          >
            Register
          </button>
          <p className="switch-to-login-text">
            Already registered? <a
              className="switch-to-login"
              href="/#"
              onClick={this.switchFormDecorator('login')}
            >
              Log in here
            </a>
          </p>
        </form>
      </div>
    )
  }
}

export default RegisterForm
