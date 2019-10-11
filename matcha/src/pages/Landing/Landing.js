import React, { Component } from 'react'

import './Landing.css'

import LoginForm from '../../components/targeted_components/Landing/LoginForm/LoginForm'
import RegisterForm from '../../components/targeted_components/Landing/RegisterForm/RegisterForm'
import ResetSendEmailForm from '../../components/targeted_components/Landing/ResetSendEmailForm/ResetSendEmailForm'
import ResetChangePassForm from '../../components/targeted_components/Landing/ResetChangePassForm/ResetChangePassForm'

export class Landing extends Component {
  constructor(props) {
    super(props)

    this.state = {
      formToShow: 'login'
    }

    this.switchForm = this.switchForm.bind(this)
    this.getForm = this.getForm.bind(this)
  }

  switchForm(formString) {

    if (formString === 'login') {

      this.setState({ formToShow: 'login' })
    }

    if (formString === 'register') {

      this.setState({ formToShow: 'register' })
    }

    if (formString === 'resetSendEmail') {

      this.setState({ formToShow: 'resetSendEmail' })
    }

    if (formString === 'resetChangePass') {

      this.setState({ formToShow: 'resetChangePass' })
    }
  }

  getForm() {

    let formToReturn = null

    switch (this.state.formToShow) {
      case "login":
        formToReturn = <LoginForm switchForm={this.switchForm} />
        break
      case "register":
        formToReturn = <RegisterForm switchForm={this.switchForm} />
        break
      case "resetSendEmail":
        formToReturn = <ResetSendEmailForm switchForm={this.switchForm}/>
        break
      case "resetChangePass":
        formToReturn = null
        break
      default:
        formToReturn = null
    }

    return formToReturn
  }

  render() {
    return (
      <div className="landing-body">
        <div className="landing-form-container">
          { this.getForm() }
        </div>
      </div>
    )
  }
}

export default Landing
