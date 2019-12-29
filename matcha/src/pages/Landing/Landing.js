import React, { Component } from 'react'
// import { Redirect } from "react-router-dom";
import queryString from 'query-string'
import InputValidation from '../../helpers/InputValidation'

import './Landing.css'

import LoginForm from '../../components/targeted_components/Landing/LoginForm/LoginForm'
import RegisterForm from '../../components/targeted_components/Landing/RegisterForm/RegisterForm'
import ResetSendEmailForm from '../../components/targeted_components/Landing/ResetSendEmailForm/ResetSendEmailForm'
import RegistrationSuccess from '../../components/targeted_components/Landing/RegistrationSuccess/RegistrationSuccess'
import VerifyRegistration from '../../components/targeted_components/Landing/VerifyRegistration/VerifyRegistration'
import VerifyReset from '../../components/targeted_components/Landing/VerifyReset/VerifyReset'

export class Landing extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // redirectTo: '',
      formToShow: 'login',
      uuid: ''
    }

    this.switchForm = this.switchForm.bind(this)
    this.getForm = this.getForm.bind(this)
  }
  
  componentDidMount() {

    // Redirect to profile if user is already logged in.
    // if (
    //   document.cookie &&
    //   document.cookie.includes('=') &&
    //   document.cookie.split('=')[0] === 'sid' &&
    //   (document.cookie.split('=')[1]).length >= 80 &&
    //   (document.cookie.split('=')[1]).length <= 100
    // ) {

    //   return this.setState({
    //     redirectTo: '/profile'
    //   })
    // }

    const parsedQueryString = queryString.parse(this.props.location.search);

    if (
      parsedQueryString.verify &&
      typeof parsedQueryString.verify === 'string' &&
      parsedQueryString.verify !== '' &&
      InputValidation.isValidUuid(parsedQueryString.verify)
    ) {

      this.setState({
        formToShow: 'verifyRegistration',
        uuid: parsedQueryString.verify
      })
    }

    if (
      parsedQueryString.reset &&
      typeof parsedQueryString.reset === 'string' &&
      parsedQueryString.reset !== '' &&
      InputValidation.isValidUuid(parsedQueryString.reset)
    ) {

      this.setState({
        formToShow: 'verifyReset',
        uuid: parsedQueryString.reset
      })
    }
  }

  switchForm(formString) {

    if (formString === 'login') {

      this.setState({
        formToShow: 'login'
      })
    }

    if (formString === 'register') {

      this.setState({
        formToShow: 'register'
      })
    }

    if (formString === 'resetSendEmail') {

      this.setState({
        formToShow: 'resetSendEmail'
      })
    }

    if (formString === 'registrationSuccess') {

      this.setState({
        formToShow: 'registrationSuccess'
      })
    }
  }

  getForm() {

    let formToReturn = null

    switch (this.state.formToShow) {
      case "login":
        formToReturn = <LoginForm switchForm={this.switchForm} getNotificationData={this.props.getNotificationData}/>
        break
      case "register":
        formToReturn = <RegisterForm switchForm={this.switchForm} />
        break
      case "resetSendEmail":
        formToReturn = <ResetSendEmailForm switchForm={this.switchForm} />
        break
      case "registrationSuccess":
        formToReturn = <RegistrationSuccess switchForm={this.switchForm} />
        break
      case "verifyRegistration":
        formToReturn = <VerifyRegistration switchForm={this.switchForm} uuid={this.state.uuid}/>
        break
      case "verifyReset":
        formToReturn = <VerifyReset switchForm={this.switchForm} uuid={this.state.uuid}/>
        break
      default:
        formToReturn = null
    }

    return formToReturn
  }

  render() {
    return (
      <div className="landing-body">
        {/* {
          this.state.redirectTo
            ? <Redirect to={`${this.state.redirectTo}`}/>
            : null
        } */}
        <div className="landing-form-container">
          { this.getForm() }
        </div>
      </div>
    )
  }
}

export default Landing
