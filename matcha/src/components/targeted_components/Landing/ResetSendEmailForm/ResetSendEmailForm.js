import React, { Component } from 'react'
import InputValidation from '../../../../helpers/InputValidation'
import PromiseCancel from '../../../../helpers/PromiseCancel'

import './ResetSendEmailForm.css'
import checkmark from '../../../../assets/tick4.png'

export class ResetSendEmailForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      emailValid: true,
      errorToShow: '',
      showEmailSent: false
    }

    this.pendingPromises = []

    this.handleChangeDecorator = this.handleChangeDecorator.bind(this)
    this.showCorrectErrors = this.showCorrectErrors.bind(this)
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

      console.log(`email: ${this.state.email}`)
      console.log('Reset send email form submitted!')

      this.setState({
        showEmailSent: true
      })

      // TODO: Call provider here.

      // TODO: Remove this after provider code is in.
      // const cancelableShowEmailSentPromise = PromiseCancel.makeCancelable(
      //   new Promise(res => setTimeout(() => res(true), 7000))
      // )

      // this.pendingPromises.push(cancelableShowEmailSentPromise)

      // cancelableShowEmailSentPromise.promise
      //   .then(() => {
  
      //     this.setState({
      //       showEmailSent: false
      //     })
      //   })
      //   .catch(() => {})
    }
  }

  render() {
    return (
      <div className="reset-send-email-body">
        {
          !this.state.showEmailSent
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
              </form>
            : <div className="show-email-sent-container">
                <p className="show-email-sent-message">
                  Please see the instructions in the email sent to you to reset your password
                </p>
                <img src={checkmark} alt="checkmark"/>
              </div>
            
      }
      </div>
    )
  }
}

export default ResetSendEmailForm
