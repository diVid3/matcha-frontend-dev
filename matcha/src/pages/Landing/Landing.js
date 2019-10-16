import React, { Component } from 'react'
import queryString from 'query-string'
import InputValidation from '../../helpers/InputValidation'

import './Landing.css'

import LoginForm from '../../components/targeted_components/Landing/LoginForm/LoginForm'
import RegisterForm from '../../components/targeted_components/Landing/RegisterForm/RegisterForm'
import ResetSendEmailForm from '../../components/targeted_components/Landing/ResetSendEmailForm/ResetSendEmailForm'
import RegistrationSuccess from '../../components/targeted_components/Landing/RegistrationSuccess/RegistrationSuccess'
import VerifyRegistration from '../../components/targeted_components/Landing/VerifyRegistration/VerifyRegistration'

export class Landing extends Component {
  constructor(props) {
    super(props)

    this.state = {
      formToShow: 'login',
      uuid: ''
    }

    this.switchForm = this.switchForm.bind(this)
    this.getForm = this.getForm.bind(this)
  }
  
  componentDidMount() {

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

    if (formString === 'registrationSuccess') {

      this.setState({ formToShow: 'registrationSuccess' })
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
        formToReturn = <ResetSendEmailForm switchForm={this.switchForm} />
        break
      case "registrationSuccess":
        formToReturn = <RegistrationSuccess switchForm={this.switchForm} />
        break
      case "verifyRegistration":
        formToReturn = <VerifyRegistration switchForm={this.switchForm} uuid={this.state.uuid}/>
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
