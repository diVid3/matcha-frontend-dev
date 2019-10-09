import React, { Component } from 'react'

import './Landing.css';

import LoginForm from '../../components/targeted_components/Landing/LoginForm/LoginForm'
// import RegisterForm from '../../components/targeted_components/Landing/RegisterForm/RegisterForm'

export class Landing extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showLogin: true,
      showResetForm: false
    }

    this.switchForm = this.switchForm.bind(this);
    this.showResetForm = this.showResetForm.bind(this);
  }

  switchForm() {
    this.setState({
      showLogin: !this.state.showLogin
    })
  }

  showResetForm() {
    this.setState({
      showResetForm: !this.state.showResetForm
    })
    console.log(this.state.showResetForm)
  }

  render() {
    return (
      <div className="landing-body">
        <div className="landing-form-container">
          <LoginForm
            switchForm={this.switchForm}
            showResetForm={this.showResetForm}
          />
          {/* <RegisterForm switchForm={this.switchForm}/> */}
        </div>
      </div>
    )
  }
}

export default Landing
