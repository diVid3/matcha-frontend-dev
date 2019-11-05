import React, { Component } from 'react'
import InputValidation from '../../../../helpers/InputValidation'
import PromiseCancel from '../../../../helpers/PromiseCancel'
import ResetProvider from '../../../../providers/ResetProvider'
import UsersProvider from '../../../../providers/UsersProvider'

import './ResetSendEmailForm.css'
import checkmark from '../../../../assets/sent2.png'
import LoadingSpinner from '../../../shared_components/LoadingSpinner/LoadingSpinner'

export class ResetSendEmailForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      emailValid: true,
      errorToShow: '',
      showEmailSent: false,
      isLoading: false
    }

    this.pendingPromises = []

    this.handleChangeDecorator = this.handleChangeDecorator.bind(this)
    this.showCorrectErrors = this.showCorrectErrors.bind(this)
    this.switchFormDecorator = this.switchFormDecorator.bind(this)
    this.handleSubmitErrors = this.handleSubmitErrors.bind(this)
    this.handleInitialSubmit = this.handleInitialSubmit.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillUnmount() {

    this.pendingPromises.map(p => p.cancel())
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

  switchFormDecorator(formToSwitchTo) {
    
    return (e) => {

      if (e) {
        e.preventDefault()
      }

      this.props.switchForm(formToSwitchTo)
    }
  }

  handleSubmitErrors() {

    if (!this.state.emailValid) {
      
      this.setState({ errorToShow: 'Email field contains invalid characters or is empty' })
      this.showCorrectErrors()
      return
    }

    return true
  }

  handleInitialSubmit() {

    if (this.state.emailValid && this.state.email === '') {
      
      this.setState({
        emailValid: false
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
    
    if (this.state.emailValid) {

      const cancelableGetUserByEmailPromise = PromiseCancel.makeCancelable(
        UsersProvider.getUserByEmail({email: this.state.email})
      )

      this.pendingPromises.push(cancelableGetUserByEmailPromise)

      cancelableGetUserByEmailPromise.promise
      .then((json) => {

        if (!json.rows.length) {

          throw new Error('empty rows')
        }

        this.setState({
          isLoading: true
        })
      })
      .then(() => {

        const cancelableSendResetEmailPromise = PromiseCancel.makeCancelable(
          ResetProvider.sendResetEmail({ email: this.state.email })
        )

        this.pendingPromises.push(cancelableSendResetEmailPromise)

        return cancelableSendResetEmailPromise.promise
      })
      .then((json) => {

        this.setState({
          isLoading: false,
          showEmailSent: true
        })
      })
      .catch((json) => {

        if (json && json instanceof Error && json.message === 'empty rows') {
          this.setState({
            isLoading: false,
            errorToShow: 'That email isn\'t registered'
          })
          this.showCorrectErrors()
        }
        else {
          this.setState({
            isLoading: false,
            errorToShow: 'Oops something went wrong... Please try again later...'
          })
          this.showCorrectErrors()
        }
      })
    }
  }

  render() {
    return (
      <div className="reset-send-email-body">
        {
          this.state.isLoading
            ? <div className="reset-send-email-body-loading">
                <h2>Sending...</h2>
                <div className="reset-send-email-body-spinner-container">
                  <LoadingSpinner />
                </div>
              </div>
            : null
        }
        {
          this.state.showEmailSent && !this.state.isLoading
            ? <div className="show-email-sent-container">
                <p className="show-email-sent-message">
                  Please see the instructions in the email sent to you to reset your password
                </p>
                <img src={checkmark} alt="checkmark"/>
              </div>
            : null
        }
        {
          !this.state.showEmailSent && !this.state.isLoading
            ? <form onSubmit={this.handleSubmit}>
                <h2>Reset</h2>
                <p
                  className="reset-send-email-message"
                >
                  Please enter your email address and we'll send you instructions on how to reset your password
                </p>
                <input
                  className={
                    `reset-send-email-input ${
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
                {
                  this.state.errorToShow.length
                    ? <div className="reset-send-email-correct-errors-message">
                        <p>{this.state.errorToShow}</p>
                      </div>
                    : null
                }
                <button
                  className="reset-send-email-button"
                  type="submit"
                  value="Submit"
                >
                  Submit
                </button>
                <p className="reset-send-email-back">
                  <a
                    className="reset-send-email-back-link"
                    href="/#"
                    onClick={this.switchFormDecorator('login')}
                  >
                    Back
                  </a>
                </p>
              </form>
            : null
        }
      </div>
    )
  }
}

export default ResetSendEmailForm
